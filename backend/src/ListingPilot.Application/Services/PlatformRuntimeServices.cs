using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;

namespace ListingPilot.Application.Services;

public class UsageGateException : Exception
{
	public UsageGateException(UsageGateResultDto gateResult)
		: base(gateResult.Reason)
	{
		GateResult = gateResult;
	}

	public UsageGateResultDto GateResult { get; }
}

public class CurrentRequestContext
{
	public string UserId { get; init; } = string.Empty;
	public string Email { get; init; } = string.Empty;
	public string FullName { get; init; } = string.Empty;
	public string Role { get; init; } = string.Empty;
	public bool IsAuthenticated { get; init; }
	public bool IsAdmin => Role.Equals(PlatformRoles.Admin, StringComparison.OrdinalIgnoreCase);
	public string AnonymousId { get; init; } = string.Empty;
	public string Path { get; init; } = string.Empty;
	public string UserAgent { get; init; } = string.Empty;
	public string IpAddress { get; init; } = string.Empty;
}

public interface IRequestContextService
{
	CurrentRequestContext GetCurrent();
}

public class RequestContextService : IRequestContextService
{
	private readonly IHttpContextAccessor _httpContextAccessor;

	public RequestContextService(IHttpContextAccessor httpContextAccessor)
	{
		_httpContextAccessor = httpContextAccessor;
	}

	public CurrentRequestContext GetCurrent()
	{
		var context = _httpContextAccessor.HttpContext;
		var principal = context?.User;

		return new CurrentRequestContext
		{
			UserId = principal?.FindFirstValue(ClaimTypes.NameIdentifier)
				?? principal?.FindFirstValue("sub")
				?? string.Empty,
			Email = principal?.FindFirstValue(ClaimTypes.Email)
				?? principal?.FindFirstValue("email")
				?? string.Empty,
			FullName = principal?.FindFirstValue("name")
				?? principal?.Identity?.Name
				?? string.Empty,
			Role = principal?.FindFirstValue(ClaimTypes.Role)
				?? principal?.FindFirstValue("custom:role")
				?? principal?.FindAll("cognito:groups").Select(x => x.Value).FirstOrDefault()
				?? PlatformRoles.User,
			IsAuthenticated = principal?.Identity?.IsAuthenticated ?? false,
			AnonymousId = context?.Request.Headers["X-Anonymous-Id"].FirstOrDefault() ?? string.Empty,
			Path = context?.Request.Path.Value ?? string.Empty,
			UserAgent = context?.Request.Headers.UserAgent.ToString() ?? string.Empty,
			IpAddress = context?.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
		};
	}
}

public class PlatformSecrets
{
	public string AwsRegion { get; set; } = "us-east-1";
	public string CognitoUserPoolId { get; set; } = string.Empty;
	public string CognitoClientId { get; set; } = string.Empty;
	public string CognitoAdminGroupName { get; set; } = "admin";
	public string AdminBootstrapEmail { get; set; } = string.Empty;
	public string AdminBootstrapTempPassword { get; set; } = string.Empty;
	public string StripeSecretKey { get; set; } = string.Empty;
	public string StripeWebhookSecret { get; set; } = string.Empty;
	public string StripePublishableKey { get; set; } = string.Empty;
	public string StripePriceMapJson { get; set; } = string.Empty;
	public string SesFromAddress { get; set; } = string.Empty;
}

public interface IPlatformSecretsService
{
	Task<PlatformSecrets> GetSecretsAsync();
}

public class PlatformSecretsService : IPlatformSecretsService
{
	private readonly IConfiguration _configuration;
	private readonly IAmazonSimpleSystemsManagement _ssm;
	private readonly IMemoryCache _memoryCache;

	public PlatformSecretsService(IConfiguration configuration, IAmazonSimpleSystemsManagement ssm, IMemoryCache memoryCache)
	{
		_configuration = configuration;
		_ssm = ssm;
		_memoryCache = memoryCache;
	}

	public async Task<PlatformSecrets> GetSecretsAsync()
	{
		if (_memoryCache.TryGetValue<PlatformSecrets>("platform-secrets", out var cached) && cached != null)
		{
			return cached;
		}

		var secrets = new PlatformSecrets
		{
			AwsRegion = _configuration["AWS:Region"] ?? _configuration["AWS__Region"] ?? _configuration["Auth:CognitoRegion"] ?? "us-east-1",
			CognitoUserPoolId = await ResolveValueAsync("Auth:CognitoUserPoolId", "Auth__CognitoUserPoolId", "Auth:CognitoUserPoolIdParameterName", "Auth__CognitoUserPoolIdParameterName"),
			CognitoClientId = await ResolveValueAsync("Auth:CognitoClientId", "Auth__CognitoClientId", "Auth:CognitoClientIdParameterName", "Auth__CognitoClientIdParameterName"),
			CognitoAdminGroupName = _configuration["Auth:CognitoAdminGroup"] ?? _configuration["Auth__CognitoAdminGroup"] ?? "admin",
			AdminBootstrapEmail = await ResolveValueAsync("Admin:BootstrapEmail", "Admin__BootstrapEmail", "Admin:BootstrapEmailParameterName", "Admin__BootstrapEmailParameterName"),
			AdminBootstrapTempPassword = await ResolveValueAsync("Admin:BootstrapTempPassword", "Admin__BootstrapTempPassword", "Admin:BootstrapTempPasswordParameterName", "Admin__BootstrapTempPasswordParameterName"),
			StripeSecretKey = await ResolveValueAsync("Stripe:SecretKey", "Stripe__SecretKey", "Stripe:SecretKeyParameterName", "Stripe__SecretKeyParameterName"),
			StripeWebhookSecret = await ResolveValueAsync("Stripe:WebhookSecret", "Stripe__WebhookSecret", "Stripe:WebhookSecretParameterName", "Stripe__WebhookSecretParameterName"),
			StripePublishableKey = await ResolveValueAsync("Stripe:PublishableKey", "Stripe__PublishableKey", "Stripe:PublishableKeyParameterName", "Stripe__PublishableKeyParameterName"),
			StripePriceMapJson = await ResolveValueAsync("Stripe:PriceMapJson", "Stripe__PriceMapJson", "Stripe:PriceMapJsonParameterName", "Stripe__PriceMapJsonParameterName"),
			SesFromAddress = await ResolveValueAsync("Ses:FromAddress", "Ses__FromAddress", "Ses:FromAddressParameterName", "Ses__FromAddressParameterName"),
		};

		_memoryCache.Set("platform-secrets", secrets, TimeSpan.FromMinutes(10));
		return secrets;
	}

	private async Task<string> ResolveValueAsync(string primaryKey, string secondaryKey, string parameterKey, string parameterAltKey)
	{
		var direct = _configuration[primaryKey] ?? _configuration[secondaryKey];
		if (!string.IsNullOrWhiteSpace(direct) && !direct.StartsWith("/"))
		{
			return direct;
		}

		var parameterName = _configuration[parameterKey] ?? _configuration[parameterAltKey] ?? direct;
		if (string.IsNullOrWhiteSpace(parameterName))
		{
			return string.Empty;
		}

		try
		{
			var response = await _ssm.GetParameterAsync(new GetParameterRequest
			{
				Name = parameterName,
				WithDecryption = true,
			});
			return response.Parameter?.Value ?? string.Empty;
		}
		catch (ParameterNotFoundException)
		{
			return string.Empty;
		}
	}
}

public interface IActivityService
{
	Task TrackAsync(string eventType, Dictionary<string, string>? metadata = null, string? source = null, string? path = null, string? anonymousId = null, string? userId = null, string? userEmail = null, string? role = null);
}

public class ActivityService : IActivityService
{
	private readonly ICommerceRepository _commerceRepository;
	private readonly IRequestContextService _requestContextService;

	public ActivityService(ICommerceRepository commerceRepository, IRequestContextService requestContextService)
	{
		_commerceRepository = commerceRepository;
		_requestContextService = requestContextService;
	}

	public Task TrackAsync(string eventType, Dictionary<string, string>? metadata = null, string? source = null, string? path = null, string? anonymousId = null, string? userId = null, string? userEmail = null, string? role = null)
	{
		var current = _requestContextService.GetCurrent();
		var evt = new ActivityEventRecord
		{
			Id = Guid.NewGuid().ToString("N"),
			EventType = eventType,
			UserId = userId ?? current.UserId,
			UserEmail = userEmail ?? current.Email,
			AnonymousId = anonymousId ?? current.AnonymousId,
			Role = role ?? current.Role,
			Path = path ?? current.Path,
			Source = source ?? "web",
			IpAddress = current.IpAddress,
			UserAgent = current.UserAgent,
			OccurredAt = DateTime.UtcNow,
			Metadata = metadata ?? [],
			Pk = string.IsNullOrWhiteSpace(userId ?? current.UserId) ? "EVENT" : $"USER#{userId ?? current.UserId}",
			Sk = $"EVENT#{DateTime.UtcNow:O}#{Guid.NewGuid():N}",
			EntityType = nameof(ActivityEventRecord),
			Gsi1Pk = $"EVENTTYPE#{eventType}",
			Gsi1Sk = DateTime.UtcNow.ToString("O"),
		};

		return _commerceRepository.SaveEventAsync(evt);
	}
}

public interface IUsagePolicyService
{
	Task<UsageSummaryDto> GetUsageSummaryAsync(string scope, string anonymousId = "");
	Task<UsageSummaryDto> ConsumeGenerationAsync(string scope, string anonymousId = "");
}

public class UsagePolicyService : IUsagePolicyService
{
	private readonly ICommerceRepository _commerceRepository;
	private readonly IRequestContextService _requestContextService;
	private readonly IActivityService _activityService;

	public UsagePolicyService(ICommerceRepository commerceRepository, IRequestContextService requestContextService, IActivityService activityService)
	{
		_commerceRepository = commerceRepository;
		_requestContextService = requestContextService;
		_activityService = activityService;
	}

	public async Task<UsageSummaryDto> GetUsageSummaryAsync(string scope, string anonymousId = "")
	{
		var current = _requestContextService.GetCurrent();
		var policy = await _commerceRepository.GetUsagePolicyAsync();

		if (current.IsAuthenticated)
		{
			var user = await _commerceRepository.GetUserByIdAsync(current.UserId);
			if (user == null)
			{
				return new UsageSummaryDto { Scope = scope };
			}

			return new UsageSummaryDto
			{
				Scope = scope,
				CreditBalance = user.CreditBalance,
				IncentiveCreditBalance = user.IncentiveCreditBalance,
				RemainingDemoActions = Math.Max(0, policy.FreeWorkspaceOutputLimit - user.DemoActionsUsed),
				RemainingFreeOutputs = Math.Max(0, user.CreditBalance + user.IncentiveCreditBalance),
				GeneratedOutputs = user.OutputGeneratedCount,
				RequiresPurchase = user.CreditBalance + user.IncentiveCreditBalance <= 0,
				RequiresSignup = false,
				LockReason = user.CreditBalance + user.IncentiveCreditBalance <= 0 ? "Credits exhausted" : string.Empty,
			};
		}

		var resolvedAnonymousId = string.IsNullOrWhiteSpace(anonymousId) ? current.AnonymousId : anonymousId;
		var ledger = await _commerceRepository.GetUsageLedgerAsync("anonymous", resolvedAnonymousId, scope)
			?? CreateAnonymousLedger(resolvedAnonymousId, scope);

		return new UsageSummaryDto
		{
			Scope = scope,
			RemainingDemoActions = Math.Max(0, policy.AnonymousDemoOutputLimit - ledger.DemoActionsUsed),
			RemainingFreeOutputs = Math.Max(0, policy.AnonymousDemoOutputLimit - ledger.GeneratedOutputs),
			GeneratedOutputs = ledger.GeneratedOutputs,
			RequiresSignup = ledger.DemoActionsUsed >= policy.AnonymousDemoOutputLimit,
			LockReason = ledger.DemoActionsUsed >= policy.AnonymousDemoOutputLimit ? "Demo limit reached" : string.Empty,
		};
	}

	public async Task<UsageSummaryDto> ConsumeGenerationAsync(string scope, string anonymousId = "")
	{
		var current = _requestContextService.GetCurrent();
		var policy = await _commerceRepository.GetUsagePolicyAsync();

		if (current.IsAuthenticated)
		{
			var user = await _commerceRepository.GetUserByIdAsync(current.UserId)
				?? throw new UsageGateException(new UsageGateResultDto
				{
					Allowed = false,
					Reason = "User profile not found.",
					ConversionAction = "login",
				});

			if (!user.AccountState.Equals(AccountStates.Active, StringComparison.OrdinalIgnoreCase))
			{
				throw new UsageGateException(new UsageGateResultDto
				{
					Allowed = false,
					Reason = "Account is not active.",
					ConversionAction = "contact-support",
					Summary = await GetUsageSummaryAsync(scope, anonymousId),
				});
			}

			var availableCredits = user.CreditBalance + user.IncentiveCreditBalance;
			if (availableCredits <= 0)
			{
				var summary = await GetUsageSummaryAsync(scope, anonymousId);
				await _activityService.TrackAsync(ActivityEventTypes.DemoLimitReached, new() { ["scope"] = scope, ["reason"] = "credits_exhausted" });
				throw new UsageGateException(new UsageGateResultDto
				{
					Allowed = false,
					LockResults = true,
					Reason = "Your free credits are exhausted.",
					ConversionAction = "purchase",
					Summary = summary,
				});
			}

			if (user.IncentiveCreditBalance > 0)
			{
				user.IncentiveCreditBalance -= 1;
			}
			else
			{
				user.CreditBalance -= 1;
			}

			user.DemoActionsUsed += scope.Equals("demo", StringComparison.OrdinalIgnoreCase) ? 1 : 0;
			user.OutputGeneratedCount += 1;
			user.LastActivityAt = DateTime.UtcNow;
			user.ConversionFunnelStage = availableCredits > 1 ? user.ConversionFunnelStage : "needs_upgrade";
			await _commerceRepository.UpsertUserAsync(user);
			await _activityService.TrackAsync(ActivityEventTypes.CreditConsumed, new() { ["scope"] = scope, ["remainingCredits"] = (user.CreditBalance + user.IncentiveCreditBalance).ToString() });
			await _activityService.TrackAsync(ActivityEventTypes.OutputGenerated, new() { ["scope"] = scope });
			return await GetUsageSummaryAsync(scope, anonymousId);
		}

		var resolvedAnonymousId = string.IsNullOrWhiteSpace(anonymousId) ? current.AnonymousId : anonymousId;
		if (string.IsNullOrWhiteSpace(resolvedAnonymousId))
		{
			throw new UsageGateException(new UsageGateResultDto
			{
				Allowed = false,
				LockResults = true,
				Reason = "Anonymous demo id is required.",
				ConversionAction = "signup",
			});
		}

		var ledger = await _commerceRepository.GetUsageLedgerAsync("anonymous", resolvedAnonymousId, scope)
			?? CreateAnonymousLedger(resolvedAnonymousId, scope);

		if (ledger.DemoActionsUsed >= policy.AnonymousDemoOutputLimit)
		{
			var summary = await GetUsageSummaryAsync(scope, resolvedAnonymousId);
			await _activityService.TrackAsync(ActivityEventTypes.DemoLimitReached, new() { ["scope"] = scope, ["anonymousId"] = resolvedAnonymousId });
			throw new UsageGateException(new UsageGateResultDto
			{
				Allowed = false,
				LockResults = policy.LockResultsWhenAnonymousLimitReached,
				Reason = "Your free demo limit is reached. Create an account to continue.",
				ConversionAction = "signup",
				Summary = summary,
			});
		}

		ledger.DemoActionsUsed += 1;
		ledger.GeneratedOutputs += 1;
		ledger.UpdatedAt = DateTime.UtcNow;
		await _commerceRepository.UpsertUsageLedgerAsync(ledger);
		await _activityService.TrackAsync(ActivityEventTypes.DemoActionUsed, new() { ["scope"] = scope, ["anonymousId"] = resolvedAnonymousId, ["used"] = ledger.DemoActionsUsed.ToString() }, anonymousId: resolvedAnonymousId);
		return await GetUsageSummaryAsync(scope, resolvedAnonymousId);
	}

	private static UsageLedger CreateAnonymousLedger(string anonymousId, string scope)
	{
		return new UsageLedger
		{
			Id = Guid.NewGuid().ToString("N"),
			SubjectType = "anonymous",
			SubjectId = anonymousId,
			Scope = scope,
			Pk = $"USAGE#anonymous#{anonymousId}",
			Sk = $"SCOPE#{scope}",
			EntityType = nameof(UsageLedger),
			Gsi1Pk = $"USAGE_SCOPE#{scope}",
			Gsi1Sk = DateTime.UtcNow.ToString("O"),
		};
	}
}
