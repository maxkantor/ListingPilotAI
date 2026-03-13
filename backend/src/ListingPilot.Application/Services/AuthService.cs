using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ListingPilot.Application.Services;

public interface IAuthService
{
    Task<ExtendedAuthSessionDto> GetSessionAsync();
    Task<AuthResultDto> SignUpAsync(SignUpRequestDto request);
    Task<AuthResultDto> ConfirmEmailAsync(ConfirmEmailRequestDto request);
    Task<AuthResultDto> LoginAsync(LoginRequestDto request, bool adminOnly = false);
    Task<AuthResultDto> RefreshAsync(RefreshSessionRequestDto request);
    Task<AuthResultDto> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    Task<AuthResultDto> ResetPasswordAsync(ResetPasswordRequestDto request);
    Task LogoutAsync(LogoutRequestDto request);
}

public class AuthService : IAuthService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IPlatformSecretsService _platformSecretsService;
    private readonly ICommerceRepository _commerceRepository;
    private readonly IActivityService _activityService;
    private readonly IAmazonCognitoIdentityProvider _cognitoIdentityProvider;

    public AuthService(
        IHttpContextAccessor httpContextAccessor,
        IPlatformSecretsService platformSecretsService,
        ICommerceRepository commerceRepository,
        IActivityService activityService,
        IAmazonCognitoIdentityProvider cognitoIdentityProvider)
    {
        _httpContextAccessor = httpContextAccessor;
        _platformSecretsService = platformSecretsService;
        _commerceRepository = commerceRepository;
        _activityService = activityService;
        _cognitoIdentityProvider = cognitoIdentityProvider;
    }

    public async Task<ExtendedAuthSessionDto> GetSessionAsync()
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        var principal = _httpContextAccessor.HttpContext?.User;
        var isAuthenticated = principal?.Identity?.IsAuthenticated ?? false;
        var groups = principal?.FindAll("cognito:groups").Select(claim => claim.Value).ToList() ?? [];
        var userId = principal?.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal?.FindFirstValue("sub") ?? string.Empty;
        var email = principal?.FindFirstValue(ClaimTypes.Email) ?? principal?.FindFirstValue("email") ?? string.Empty;
        var profile = !string.IsNullOrWhiteSpace(userId)
            ? await _commerceRepository.GetUserByIdAsync(userId)
            : !string.IsNullOrWhiteSpace(email)
                ? await _commerceRepository.GetUserByEmailAsync(email)
                : null;
        var usagePolicy = await _commerceRepository.GetUsagePolicyAsync();
        var packages = await _commerceRepository.GetPackagesAsync();

        return new ExtendedAuthSessionDto
        {
            AuthEnabled = !string.IsNullOrWhiteSpace(secrets.CognitoUserPoolId),
            IdentityMode = string.IsNullOrWhiteSpace(secrets.CognitoUserPoolId)
                ? "disabled"
                : isAuthenticated ? "cognito-authenticated" : "cognito",
            CognitoRegion = secrets.AwsRegion,
            UserPoolId = secrets.CognitoUserPoolId,
            ClientId = secrets.CognitoClientId,
            IsAuthenticated = isAuthenticated,
            CurrentUserId = userId,
            CurrentUserEmail = email,
            CurrentUserName = principal?.FindFirstValue("name") ?? principal?.Identity?.Name ?? string.Empty,
            Groups = groups,
            AllowedFeatures = profile == null ? ["public-site", "limited-demo"] : BuildAllowedFeatures(profile),
            CurrentUser = profile == null ? null : MapCurrentUser(profile),
            UsagePolicy = new UsagePolicyDto
            {
                AnonymousDemoOutputLimit = usagePolicy.AnonymousDemoOutputLimit,
                AnonymousWorkflowSessions = usagePolicy.AnonymousWorkflowSessions,
                SignedUpStarterCredits = usagePolicy.SignedUpStarterCredits,
                FreeWorkspaceOutputLimit = usagePolicy.FreeWorkspaceOutputLimit,
                LockResultsWhenAnonymousLimitReached = usagePolicy.LockResultsWhenAnonymousLimitReached,
            },
            Packages = packages.Select(MapPackage).ToList(),
        };
    }

    public async Task<AuthResultDto> SignUpAsync(SignUpRequestDto request)
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        EnsureCognitoConfigured(secrets);
        await _activityService.TrackAsync(ActivityEventTypes.SignupStarted, new() { ["email"] = request.Email, ["destination"] = request.IntendedDestination });

        var response = await _cognitoIdentityProvider.SignUpAsync(new SignUpRequest
        {
            ClientId = secrets.CognitoClientId,
            Username = request.Email,
            Password = request.Password,
            UserAttributes =
            [
                new() { Name = "email", Value = request.Email },
                new() { Name = "given_name", Value = request.FirstName },
                new() { Name = "family_name", Value = request.LastName },
                new() { Name = "name", Value = $"{request.FirstName} {request.LastName}".Trim() },
            ],
        });

        var usagePolicy = await _commerceRepository.GetUsagePolicyAsync();
        var profile = new UserProfile
        {
            Id = response.UserSub,
            CognitoUsername = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            FullName = $"{request.FirstName} {request.LastName}".Trim(),
            Role = PlatformRoles.User,
            PlanCode = "free",
            CreditBalance = usagePolicy.SignedUpStarterCredits,
            EmailVerified = response.UserConfirmed,
            ConversionFunnelStage = response.UserConfirmed ? "signed_up" : "verify_email",
            AccountState = AccountStates.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Pk = $"USER#{response.UserSub}",
            Sk = "PROFILE",
            EntityType = nameof(UserProfile),
            Gsi1Pk = $"EMAIL#{request.Email.ToLowerInvariant()}",
            Gsi1Sk = "ROLE#user",
        };

        await _commerceRepository.UpsertUserAsync(profile);
        await _activityService.TrackAsync(ActivityEventTypes.SignupCompleted, new() { ["email"] = request.Email, ["confirmed"] = response.UserConfirmed.ToString() }, userId: profile.Id, userEmail: profile.Email, role: profile.Role);

        return new AuthResultDto
        {
            Success = true,
            RequiresEmailVerification = !response.UserConfirmed,
            Message = response.UserConfirmed ? "Account created successfully." : "Check your email to verify your account.",
            RedirectTo = response.UserConfirmed ? string.IsNullOrWhiteSpace(request.IntendedDestination) ? "/workspace" : request.IntendedDestination : "/verify-email",
            User = MapCurrentUser(profile),
        };
    }

    public async Task<AuthResultDto> ConfirmEmailAsync(ConfirmEmailRequestDto request)
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        EnsureCognitoConfigured(secrets);

        await _cognitoIdentityProvider.ConfirmSignUpAsync(new ConfirmSignUpRequest
        {
            ClientId = secrets.CognitoClientId,
            Username = request.Email,
            ConfirmationCode = request.Code,
        });

        var profile = await _commerceRepository.GetUserByEmailAsync(request.Email);
        if (profile != null)
        {
            profile.EmailVerified = true;
            profile.ConversionFunnelStage = "signed_up";
            await _commerceRepository.UpsertUserAsync(profile);
            await _activityService.TrackAsync(ActivityEventTypes.EmailVerified, new() { ["email"] = request.Email }, userId: profile.Id, userEmail: profile.Email, role: profile.Role);
        }

        return new AuthResultDto
        {
            Success = true,
            Message = "Email verified. You can now log in.",
            RedirectTo = "/login",
            User = profile == null ? null : MapCurrentUser(profile),
        };
    }

    public async Task<AuthResultDto> LoginAsync(LoginRequestDto request, bool adminOnly = false)
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        EnsureCognitoConfigured(secrets);

        var response = await _cognitoIdentityProvider.InitiateAuthAsync(new InitiateAuthRequest
        {
            AuthFlow = AuthFlowType.USER_PASSWORD_AUTH,
            ClientId = secrets.CognitoClientId,
            AuthParameters = new Dictionary<string, string>
            {
                ["USERNAME"] = request.Email,
                ["PASSWORD"] = request.Password,
            },
        });

        if (response.AuthenticationResult == null)
        {
            throw new InvalidOperationException("Authentication failed.");
        }

        var principal = BuildPrincipalFromIdToken(response.AuthenticationResult.IdToken);
        var profile = await EnsureProfileFromPrincipalAsync(principal, request.Email, secrets);

        if (adminOnly && !profile.IsAdmin)
        {
            throw new UnauthorizedAccessException("Admin access is required.");
        }

        profile.LastLoginAt = DateTime.UtcNow;
        profile.LastActivityAt = DateTime.UtcNow;
        await _commerceRepository.UpsertUserAsync(profile);
        await _activityService.TrackAsync(adminOnly ? ActivityEventTypes.AdminLogin : ActivityEventTypes.Login, new() { ["destination"] = request.IntendedDestination }, userId: profile.Id, userEmail: profile.Email, role: profile.Role);

        return new AuthResultDto
        {
            Success = true,
            Message = adminOnly ? "Admin login successful." : "Login successful.",
            RedirectTo = adminOnly ? "/admin" : string.IsNullOrWhiteSpace(request.IntendedDestination) ? "/workspace" : request.IntendedDestination,
            Tokens = MapTokens(response.AuthenticationResult),
            User = MapCurrentUser(profile),
        };
    }

    public async Task<AuthResultDto> RefreshAsync(RefreshSessionRequestDto request)
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        EnsureCognitoConfigured(secrets);

        var response = await _cognitoIdentityProvider.InitiateAuthAsync(new InitiateAuthRequest
        {
            AuthFlow = AuthFlowType.REFRESH_TOKEN_AUTH,
            ClientId = secrets.CognitoClientId,
            AuthParameters = new Dictionary<string, string>
            {
                ["REFRESH_TOKEN"] = request.RefreshToken,
            },
        });

        if (response.AuthenticationResult == null)
        {
            throw new InvalidOperationException("Unable to refresh session.");
        }

        var principal = BuildPrincipalFromIdToken(response.AuthenticationResult.IdToken);
        var profile = await EnsureProfileFromPrincipalAsync(principal, principal.FindFirstValue("email") ?? string.Empty, secrets);

        return new AuthResultDto
        {
            Success = true,
            Message = "Session refreshed.",
            Tokens = new AuthTokenBundleDto
            {
                AccessToken = response.AuthenticationResult.AccessToken,
                IdToken = response.AuthenticationResult.IdToken,
                RefreshToken = request.RefreshToken,
                ExpiresInSeconds = response.AuthenticationResult.ExpiresIn,
                TokenType = response.AuthenticationResult.TokenType ?? "Bearer",
            },
            User = MapCurrentUser(profile),
        };
    }

    public async Task<AuthResultDto> ForgotPasswordAsync(ForgotPasswordRequestDto request)
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        EnsureCognitoConfigured(secrets);

        await _cognitoIdentityProvider.ForgotPasswordAsync(new ForgotPasswordRequest
        {
            ClientId = secrets.CognitoClientId,
            Username = request.Email,
        });

        return new AuthResultDto
        {
            Success = true,
            Message = "Password reset code sent.",
        };
    }

    public async Task<AuthResultDto> ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        EnsureCognitoConfigured(secrets);

        await _cognitoIdentityProvider.ConfirmForgotPasswordAsync(new ConfirmForgotPasswordRequest
        {
            ClientId = secrets.CognitoClientId,
            Username = request.Email,
            ConfirmationCode = request.Code,
            Password = request.NewPassword,
        });

        return new AuthResultDto
        {
            Success = true,
            Message = "Password updated successfully.",
            RedirectTo = "/login",
        };
    }

    public async Task LogoutAsync(LogoutRequestDto request)
    {
        var secrets = await _platformSecretsService.GetSecretsAsync();
        if (!string.IsNullOrWhiteSpace(secrets.CognitoUserPoolId) && !string.IsNullOrWhiteSpace(request.AccessToken))
        {
            await _cognitoIdentityProvider.GlobalSignOutAsync(new GlobalSignOutRequest
            {
                AccessToken = request.AccessToken,
            });
        }

        await _activityService.TrackAsync(ActivityEventTypes.Logout);
    }

    private async Task<UserProfile> EnsureProfileFromPrincipalAsync(ClaimsPrincipal principal, string emailFallback, PlatformSecrets secrets)
    {
        var userId = principal.FindFirstValue("sub") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.NewGuid().ToString("N");
        var email = principal.FindFirstValue("email") ?? emailFallback;
        var firstName = principal.FindFirstValue("given_name") ?? string.Empty;
        var lastName = principal.FindFirstValue("family_name") ?? string.Empty;
        var fullName = principal.FindFirstValue("name") ?? $"{firstName} {lastName}".Trim();
        var groups = principal.FindAll("cognito:groups").Select(x => x.Value).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var isBootstrapAdmin = !string.IsNullOrWhiteSpace(secrets.AdminBootstrapEmail)
            && email.Equals(secrets.AdminBootstrapEmail, StringComparison.OrdinalIgnoreCase);
        var profile = await _commerceRepository.GetUserByIdAsync(userId) ?? await _commerceRepository.GetUserByEmailAsync(email);
        var usagePolicy = await _commerceRepository.GetUsagePolicyAsync();

        profile ??= new UserProfile
        {
            Id = userId,
            Pk = $"USER#{userId}",
            Sk = "PROFILE",
            EntityType = nameof(UserProfile),
            CreatedAt = DateTime.UtcNow,
            CreditBalance = usagePolicy.SignedUpStarterCredits,
            PlanCode = "free",
            ConversionFunnelStage = "signed_up",
        };

        profile.CognitoUsername = email;
        profile.Email = email;
        profile.FirstName = firstName;
        profile.LastName = lastName;
        profile.FullName = fullName;
        profile.IsAdmin = groups.Contains(secrets.CognitoAdminGroupName) || isBootstrapAdmin;
        profile.Role = profile.IsAdmin ? PlatformRoles.Admin : PlatformRoles.User;
        profile.AccountState = string.IsNullOrWhiteSpace(profile.AccountState) ? AccountStates.Active : profile.AccountState;
        profile.EmailVerified = bool.TryParse(principal.FindFirstValue("email_verified"), out var emailVerified)
            ? emailVerified
            : profile.EmailVerified;
        profile.UpdatedAt = DateTime.UtcNow;
        profile.LastActivityAt = DateTime.UtcNow;
        profile.Gsi1Pk = $"EMAIL#{email.ToLowerInvariant()}";
        profile.Gsi1Sk = $"ROLE#{profile.Role}";
        return await _commerceRepository.UpsertUserAsync(profile);
    }

    private static List<string> BuildAllowedFeatures(UserProfile profile)
    {
        var features = new List<string> { "workspace", "history", "usage-meter" };
        if (profile.CreditBalance + profile.IncentiveCreditBalance > 0)
        {
            features.Add("generation");
        }

        if (profile.PlanCode is "growth" or "agency")
        {
            features.Add("analytics");
        }

        if (profile.Role.Equals(PlatformRoles.Admin, StringComparison.OrdinalIgnoreCase))
        {
            features.Add("admin-crm");
        }

        return features;
    }

    private static CurrentUserDto MapCurrentUser(UserProfile profile)
    {
        return new CurrentUserDto
        {
            Id = profile.Id,
            Email = profile.Email,
            FullName = profile.FullName,
            Role = profile.Role,
            AccountState = profile.AccountState,
            EmailVerified = profile.EmailVerified,
            PlanCode = profile.PlanCode,
            CreditBalance = profile.CreditBalance,
            IncentiveCreditBalance = profile.IncentiveCreditBalance,
            DemoActionsUsed = profile.DemoActionsUsed,
            OutputGeneratedCount = profile.OutputGeneratedCount,
            ConversionFunnelStage = profile.ConversionFunnelStage,
        };
    }

    private static MonetizationPackageDto MapPackage(MonetizationPackage package)
    {
        return new MonetizationPackageDto
        {
            Id = package.Id,
            Code = package.Code,
            Name = package.Name,
            Description = package.Description,
            BillingMode = package.BillingMode,
            Credits = package.Credits,
            AccessLevel = package.AccessLevel,
            IncludesAdminCapabilities = package.IncludesAdminCapabilities,
            IncludesTeamCapabilities = package.IncludesTeamCapabilities,
            PriceUsd = package.PriceUsd,
            IsFeatured = package.IsFeatured,
            Features = package.Features,
        };
    }

    private static AuthTokenBundleDto MapTokens(AuthenticationResultType auth)
    {
        return new AuthTokenBundleDto
        {
            AccessToken = auth.AccessToken,
            IdToken = auth.IdToken,
            RefreshToken = auth.RefreshToken ?? string.Empty,
            ExpiresInSeconds = auth.ExpiresIn,
            TokenType = auth.TokenType ?? "Bearer",
        };
    }

    private static ClaimsPrincipal BuildPrincipalFromIdToken(string? idToken)
    {
        if (string.IsNullOrWhiteSpace(idToken))
        {
            return new ClaimsPrincipal(new ClaimsIdentity());
        }

        var token = new JwtSecurityTokenHandler().ReadJwtToken(idToken);
        return new ClaimsPrincipal(new ClaimsIdentity(token.Claims, "cognito"));
    }

    private static void EnsureCognitoConfigured(PlatformSecrets secrets)
    {
        if (string.IsNullOrWhiteSpace(secrets.CognitoUserPoolId) || string.IsNullOrWhiteSpace(secrets.CognitoClientId))
        {
            throw new InvalidOperationException("Cognito configuration is missing.");
        }
    }
}
