using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;
using Stripe;
using Stripe.Checkout;
using System.Text.Json;

namespace ListingPilot.Application.Services;

public interface IBillingService
{
	Task<List<MonetizationPackageDto>> GetPackagesAsync();
	Task<List<PurchaseRecordDto>> GetMyPurchasesAsync();
	Task<CheckoutSessionResponseDto> CreateCheckoutSessionAsync(CheckoutSessionRequestDto request);
	Task HandleWebhookAsync(string payload, string signatureHeader);
}

public class BillingService : IBillingService
{
	private readonly ICommerceRepository _commerceRepository;
	private readonly IRequestContextService _requestContextService;
	private readonly IPlatformSecretsService _platformSecretsService;
	private readonly IActivityService _activityService;

	public BillingService(
		ICommerceRepository commerceRepository,
		IRequestContextService requestContextService,
		IPlatformSecretsService platformSecretsService,
		IActivityService activityService)
	{
		_commerceRepository = commerceRepository;
		_requestContextService = requestContextService;
		_platformSecretsService = platformSecretsService;
		_activityService = activityService;
	}

	public async Task<List<MonetizationPackageDto>> GetPackagesAsync()
	{
		var packages = await _commerceRepository.GetPackagesAsync();
		return packages.Select(package => new MonetizationPackageDto
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
		}).ToList();
	}

	public async Task<List<PurchaseRecordDto>> GetMyPurchasesAsync()
	{
		var current = _requestContextService.GetCurrent();
		var purchases = await _commerceRepository.GetPurchasesByUserIdAsync(current.UserId);
		return purchases.Select(MapPurchase).ToList();
	}

	public async Task<CheckoutSessionResponseDto> CreateCheckoutSessionAsync(CheckoutSessionRequestDto request)
	{
		var current = _requestContextService.GetCurrent();
		if (!current.IsAuthenticated)
		{
			throw new UnauthorizedAccessException("Authentication is required before checkout.");
		}

		var packages = await _commerceRepository.GetPackagesAsync();
		var package = packages.FirstOrDefault(x => x.Code.Equals(request.PackageCode, StringComparison.OrdinalIgnoreCase))
			?? throw new InvalidOperationException("Package not found.");
		var user = await _commerceRepository.GetUserByIdAsync(current.UserId)
			?? throw new InvalidOperationException("User not found.");
		var secrets = await _platformSecretsService.GetSecretsAsync();
		if (string.IsNullOrWhiteSpace(secrets.StripeSecretKey))
		{
			throw new InvalidOperationException("Stripe is not configured.");
		}

		StripeConfiguration.ApiKey = secrets.StripeSecretKey;

		var purchase = new PurchaseRecord
		{
			Id = Guid.NewGuid().ToString("N"),
			UserId = user.Id,
			UserEmail = user.Email,
			PackageCode = package.Code,
			Status = PurchaseStatuses.Pending,
			AmountUsd = package.PriceUsd,
			Currency = package.Currency,
			CreditsGranted = package.Credits,
			CreatedAt = DateTime.UtcNow,
			Pk = $"USER#{user.Id}",
			Sk = $"PURCHASE#{DateTime.UtcNow:O}#{Guid.NewGuid():N}",
			EntityType = nameof(PurchaseRecord),
			Gsi1Pk = $"PURCHASE_STATUS#{PurchaseStatuses.Pending}",
			Gsi1Sk = DateTime.UtcNow.ToString("O"),
		};

		var sessionService = new SessionService();
		var session = await sessionService.CreateAsync(new SessionCreateOptions
		{
			Mode = "payment",
			SuccessUrl = request.SuccessUrl,
			CancelUrl = request.CancelUrl,
			CustomerEmail = user.Email,
			Metadata = new Dictionary<string, string>
			{
				["purchaseId"] = purchase.Id,
				["userId"] = user.Id,
				["packageCode"] = package.Code,
			},
			LineItems =
			[
				new SessionLineItemOptions
				{
					Quantity = 1,
					PriceData = new SessionLineItemPriceDataOptions
					{
						Currency = package.Currency,
						UnitAmountDecimal = package.PriceUsd * 100,
						ProductData = new SessionLineItemPriceDataProductDataOptions
						{
							Name = package.Name,
							Description = package.Description,
							Metadata = new Dictionary<string, string>
							{
								["packageCode"] = package.Code,
								["credits"] = package.Credits.ToString(),
							},
						},
					},
				},
			],
		});

		purchase.StripeCheckoutSessionId = session.Id;
		purchase.StripeCustomerId = session.CustomerId ?? user.StripeCustomerId;
		purchase.RawMetadataJson = JsonSerializer.Serialize(session.Metadata ?? new Dictionary<string, string>());
		await _commerceRepository.SavePurchaseAsync(purchase);
		await _activityService.TrackAsync(ActivityEventTypes.CheckoutSessionCreated, new() { ["packageCode"] = package.Code, ["purchaseId"] = purchase.Id, ["sessionId"] = session.Id }, userId: user.Id, userEmail: user.Email, role: user.Role);

		return new CheckoutSessionResponseDto
		{
			CheckoutUrl = session.Url ?? string.Empty,
			PurchaseId = purchase.Id,
		};
	}

	public async Task HandleWebhookAsync(string payload, string signatureHeader)
	{
		var secrets = await _platformSecretsService.GetSecretsAsync();
		if (string.IsNullOrWhiteSpace(secrets.StripeSecretKey) || string.IsNullOrWhiteSpace(secrets.StripeWebhookSecret))
		{
			throw new InvalidOperationException("Stripe webhook configuration is missing.");
		}

		StripeConfiguration.ApiKey = secrets.StripeSecretKey;
		var stripeEvent = EventUtility.ConstructEvent(payload, signatureHeader, secrets.StripeWebhookSecret);

		switch (stripeEvent.Type)
		{
			case EventTypes.CheckoutSessionCompleted:
			{
				var session = stripeEvent.Data.Object as Session;
				if (session == null)
				{
					return;
				}

				await FulfillCompletedCheckoutAsync(session);
				break;
			}
			case EventTypes.PaymentIntentPaymentFailed:
			{
				var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
				if (paymentIntent != null)
				{
					await MarkFailedPurchaseAsync(paymentIntent.Id);
				}

				break;
			}
			case EventTypes.ChargeRefunded:
			{
				var charge = stripeEvent.Data.Object as Charge;
				if (charge != null)
				{
					await MarkRefundedPurchaseAsync(charge.PaymentIntentId);
				}

				break;
			}
		}
	}

	private async Task FulfillCompletedCheckoutAsync(Session session)
	{
		var purchaseId = session.Metadata.TryGetValue("purchaseId", out var metadataPurchaseId) ? metadataPurchaseId : string.Empty;
		var purchase = !string.IsNullOrWhiteSpace(purchaseId)
			? (await _commerceRepository.ListPurchasesAsync()).FirstOrDefault(x => x.Id == purchaseId)
			: await _commerceRepository.GetPurchaseByCheckoutSessionIdAsync(session.Id);
		if (purchase == null || purchase.Status == PurchaseStatuses.Completed)
		{
			return;
		}

		var user = await _commerceRepository.GetUserByIdAsync(purchase.UserId)
			?? throw new InvalidOperationException("Unable to resolve user for purchase fulfillment.");

		purchase.Status = PurchaseStatuses.Completed;
		purchase.CompletedAt = DateTime.UtcNow;
		purchase.StripePaymentIntentId = session.PaymentIntentId ?? purchase.StripePaymentIntentId;
		purchase.StripeCustomerId = session.CustomerId ?? purchase.StripeCustomerId;
		purchase.InvoiceId = session.InvoiceId ?? purchase.InvoiceId;
		await _commerceRepository.SavePurchaseAsync(purchase);

		user.CreditBalance += purchase.CreditsGranted;
		user.PackagePurchaseCount += 1;
		user.PlanCode = purchase.PackageCode;
		user.ConversionFunnelStage = "paid";
		user.StripeCustomerId = purchase.StripeCustomerId;
		await _commerceRepository.UpsertUserAsync(user);

		await _activityService.TrackAsync(ActivityEventTypes.CheckoutCompleted, new() { ["purchaseId"] = purchase.Id, ["packageCode"] = purchase.PackageCode }, userId: user.Id, userEmail: user.Email, role: user.Role);
		await _activityService.TrackAsync(ActivityEventTypes.PackageGranted, new() { ["packageCode"] = purchase.PackageCode, ["creditsGranted"] = purchase.CreditsGranted.ToString() }, userId: user.Id, userEmail: user.Email, role: user.Role);
		await _activityService.TrackAsync(ActivityEventTypes.CreditsUpdated, new() { ["creditBalance"] = user.CreditBalance.ToString() }, userId: user.Id, userEmail: user.Email, role: user.Role);
	}

	private async Task MarkFailedPurchaseAsync(string paymentIntentId)
	{
		var purchase = (await _commerceRepository.ListPurchasesAsync()).FirstOrDefault(x => x.StripePaymentIntentId == paymentIntentId || x.StripeCheckoutSessionId == paymentIntentId);
		if (purchase == null)
		{
			return;
		}

		purchase.Status = PurchaseStatuses.Failed;
		await _commerceRepository.SavePurchaseAsync(purchase);
		await _activityService.TrackAsync(ActivityEventTypes.PaymentFailed, new() { ["purchaseId"] = purchase.Id, ["paymentIntentId"] = paymentIntentId }, userId: purchase.UserId, userEmail: purchase.UserEmail);
	}

	private async Task MarkRefundedPurchaseAsync(string paymentIntentId)
	{
		var purchase = (await _commerceRepository.ListPurchasesAsync()).FirstOrDefault(x => x.StripePaymentIntentId == paymentIntentId);
		if (purchase == null)
		{
			return;
		}

		purchase.Status = PurchaseStatuses.Refunded;
		await _commerceRepository.SavePurchaseAsync(purchase);

		var user = await _commerceRepository.GetUserByIdAsync(purchase.UserId);
		if (user != null)
		{
			user.CreditBalance = Math.Max(0, user.CreditBalance - purchase.CreditsGranted);
			await _commerceRepository.UpsertUserAsync(user);
			await _activityService.TrackAsync(ActivityEventTypes.RefundProcessed, new() { ["purchaseId"] = purchase.Id, ["paymentIntentId"] = paymentIntentId }, userId: user.Id, userEmail: user.Email, role: user.Role);
		}
	}

	private static PurchaseRecordDto MapPurchase(PurchaseRecord purchase)
	{
		return new PurchaseRecordDto
		{
			Id = purchase.Id,
			PackageCode = purchase.PackageCode,
			Status = purchase.Status,
			AmountUsd = purchase.AmountUsd,
			CreditsGranted = purchase.CreditsGranted,
			ReceiptUrl = purchase.ReceiptUrl,
			CreatedAt = purchase.CreatedAt.ToString("O"),
			CompletedAt = purchase.CompletedAt?.ToString("O") ?? string.Empty,
		};
	}
}
