using ListingPilot.Domain.Entities;

namespace ListingPilot.Infrastructure.Repositories;

public interface ICommerceRepository
{
	Task<UsagePolicyConfig> GetUsagePolicyAsync();
	Task<List<MonetizationPackage>> GetPackagesAsync();
	Task<UserProfile?> GetUserByIdAsync(string userId);
	Task<UserProfile?> GetUserByEmailAsync(string email);
	Task<List<UserProfile>> ListUsersAsync();
	Task<UserProfile> UpsertUserAsync(UserProfile user);
	Task<UsageLedger?> GetUsageLedgerAsync(string subjectType, string subjectId, string scope);
	Task<UsageLedger> UpsertUsageLedgerAsync(UsageLedger ledger);
	Task<ActivityEventRecord> SaveEventAsync(ActivityEventRecord activityEvent);
	Task<List<ActivityEventRecord>> ListEventsAsync(int take = 200);
	Task<List<ActivityEventRecord>> GetUserEventsAsync(string userId, int take = 200);
	Task<PurchaseRecord?> GetPurchaseByCheckoutSessionIdAsync(string checkoutSessionId);
	Task<PurchaseRecord> SavePurchaseAsync(PurchaseRecord purchase);
	Task<List<PurchaseRecord>> GetPurchasesByUserIdAsync(string userId);
	Task<List<PurchaseRecord>> ListPurchasesAsync();
	Task<ContactInquiry> SaveContactInquiryAsync(ContactInquiry inquiry);
	Task<ContactInquiry?> GetContactInquiryAsync(string inquiryId);
	Task<List<ContactInquiry>> ListContactInquiriesAsync();
	Task<ContactReplyRecord> SaveContactReplyAsync(ContactReplyRecord reply);
	Task<List<ContactReplyRecord>> GetContactRepliesAsync(string inquiryId);
	Task<UserNoteRecord> SaveUserNoteAsync(UserNoteRecord note);
	Task<List<UserNoteRecord>> GetUserNotesAsync(string userId);
	Task<AdminActionRecord> SaveAdminActionAsync(AdminActionRecord action);
	Task<List<AdminActionRecord>> ListAdminActionsAsync();
	Task<List<AdminActionRecord>> GetAdminActionsForUserAsync(string userId);
}

public class InMemoryCommerceRepository : ICommerceRepository
{
	private static readonly UsagePolicyConfig UsagePolicy = new()
	{
		Pk = "CONFIG",
		Sk = "USAGE_POLICY",
		EntityType = nameof(UsagePolicyConfig),
	};

	private static readonly List<MonetizationPackage> Packages =
	[
		new()
		{
			Id = "pkg-starter",
			Code = "starter",
			Name = "Starter package",
			Description = "Fast access to premium ListingPilot outputs for solo agents.",
			BillingMode = "one_time",
			Credits = 25,
			AccessLevel = "starter",
			PriceUsd = 29,
			Currency = "usd",
			StripePriceLookupKey = "listingpilot_starter",
			Features = ["25 generation credits", "Core workspace access", "Email support"],
			Pk = "CONFIG",
			Sk = "PACKAGE#starter",
			EntityType = nameof(MonetizationPackage),
		},
		new()
		{
			Id = "pkg-growth",
			Code = "growth",
			Name = "Growth package",
			Description = "Higher throughput, analytics visibility, and faster campaign iteration.",
			BillingMode = "one_time",
			Credits = 100,
			AccessLevel = "growth",
			PriceUsd = 99,
			Currency = "usd",
			IsFeatured = true,
			StripePriceLookupKey = "listingpilot_growth",
			Features = ["100 generation credits", "History + analytics", "Priority support"],
			Pk = "CONFIG",
			Sk = "PACKAGE#growth",
			EntityType = nameof(MonetizationPackage),
		},
		new()
		{
			Id = "pkg-agency",
			Code = "agency",
			Name = "Agency package",
			Description = "Admin-grade rollout for teams with shared controls and higher credit volume.",
			BillingMode = "one_time",
			Credits = 300,
			AccessLevel = "agency",
			IncludesAdminCapabilities = true,
			IncludesTeamCapabilities = true,
			PriceUsd = 249,
			Currency = "usd",
			StripePriceLookupKey = "listingpilot_agency",
			Features = ["300 generation credits", "Team admin controls", "Rollout support"],
			Pk = "CONFIG",
			Sk = "PACKAGE#agency",
			EntityType = nameof(MonetizationPackage),
		},
	];

	private static readonly List<UserProfile> Users =
	[
		new()
		{
			Id = "user-admin-seed",
			CognitoUsername = "mykantor@bellsouth.net",
			Email = "mykantor@bellsouth.net",
			FirstName = "Max",
			LastName = "Kantor",
			FullName = "Max Kantor",
			Role = PlatformRoles.Admin,
			IsAdmin = true,
			EmailVerified = true,
			PlanCode = "agency",
			CreditBalance = 999,
			AccountState = AccountStates.Active,
			CreatedAt = DateTime.UtcNow.AddDays(-10),
			UpdatedAt = DateTime.UtcNow.AddMinutes(-30),
			LastActivityAt = DateTime.UtcNow.AddMinutes(-15),
			LastLoginAt = DateTime.UtcNow.AddMinutes(-20),
			ConversionFunnelStage = "paid",
			TeamName = "ListingPilot",
			Pk = "USER#user-admin-seed",
			Sk = "PROFILE",
			EntityType = nameof(UserProfile),
			Gsi1Pk = "EMAIL#mykantor@bellsouth.net",
			Gsi1Sk = "ROLE#admin",
		},
		new()
		{
			Id = "user-free-seed",
			CognitoUsername = "maya@listingpilot.ai",
			Email = "maya@listingpilot.ai",
			FirstName = "Maya",
			LastName = "Reynolds",
			FullName = "Maya Reynolds",
			Role = PlatformRoles.User,
			EmailVerified = true,
			PlanCode = "free",
			CreditBalance = 3,
			AccountState = AccountStates.Active,
			CreatedAt = DateTime.UtcNow.AddDays(-5),
			UpdatedAt = DateTime.UtcNow.AddHours(-1),
			LastActivityAt = DateTime.UtcNow.AddMinutes(-18),
			LastLoginAt = DateTime.UtcNow.AddHours(-2),
			ConversionFunnelStage = "signed_up",
			TeamName = "Atlanta Luxury Group",
			Pk = "USER#user-free-seed",
			Sk = "PROFILE",
			EntityType = nameof(UserProfile),
			Gsi1Pk = "EMAIL#maya@listingpilot.ai",
			Gsi1Sk = "ROLE#user",
		},
	];

	private static readonly List<UsageLedger> Ledgers = [];
	private static readonly List<ActivityEventRecord> Events = [];
	private static readonly List<PurchaseRecord> Purchases = [];
	private static readonly List<ContactInquiry> Inquiries = [];
	private static readonly List<ContactReplyRecord> Replies = [];
	private static readonly List<UserNoteRecord> Notes = [];
	private static readonly List<AdminActionRecord> AdminActions = [];

	public Task<UsagePolicyConfig> GetUsagePolicyAsync() => Task.FromResult(UsagePolicy);

	public Task<List<MonetizationPackage>> GetPackagesAsync() => Task.FromResult(Packages.OrderBy(x => x.PriceUsd).ToList());

	public Task<UserProfile?> GetUserByIdAsync(string userId) => Task.FromResult(Users.FirstOrDefault(x => x.Id == userId));

	public Task<UserProfile?> GetUserByEmailAsync(string email) => Task.FromResult(Users.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase)));

	public Task<List<UserProfile>> ListUsersAsync() => Task.FromResult(Users.OrderByDescending(x => x.CreatedAt).ToList());

	public Task<UserProfile> UpsertUserAsync(UserProfile user)
	{
		var existing = Users.FindIndex(x => x.Id == user.Id || x.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase));
		user.UpdatedAt = DateTime.UtcNow;
		if (existing >= 0)
		{
			Users[existing] = user;
		}
		else
		{
			Users.Add(user);
		}

		return Task.FromResult(user);
	}

	public Task<UsageLedger?> GetUsageLedgerAsync(string subjectType, string subjectId, string scope)
		=> Task.FromResult(Ledgers.FirstOrDefault(x => x.SubjectType == subjectType && x.SubjectId == subjectId && x.Scope == scope));

	public Task<UsageLedger> UpsertUsageLedgerAsync(UsageLedger ledger)
	{
		var existing = Ledgers.FindIndex(x => x.SubjectType == ledger.SubjectType && x.SubjectId == ledger.SubjectId && x.Scope == ledger.Scope);
		ledger.UpdatedAt = DateTime.UtcNow;
		if (existing >= 0)
		{
			Ledgers[existing] = ledger;
		}
		else
		{
			Ledgers.Add(ledger);
		}

		return Task.FromResult(ledger);
	}

	public Task<ActivityEventRecord> SaveEventAsync(ActivityEventRecord activityEvent)
	{
		Events.Add(activityEvent);
		return Task.FromResult(activityEvent);
	}

	public Task<List<ActivityEventRecord>> ListEventsAsync(int take = 200)
		=> Task.FromResult(Events.OrderByDescending(x => x.OccurredAt).Take(take).ToList());

	public Task<List<ActivityEventRecord>> GetUserEventsAsync(string userId, int take = 200)
		=> Task.FromResult(Events.Where(x => x.UserId == userId).OrderByDescending(x => x.OccurredAt).Take(take).ToList());

	public Task<PurchaseRecord?> GetPurchaseByCheckoutSessionIdAsync(string checkoutSessionId)
		=> Task.FromResult(Purchases.FirstOrDefault(x => x.StripeCheckoutSessionId == checkoutSessionId));

	public Task<PurchaseRecord> SavePurchaseAsync(PurchaseRecord purchase)
	{
		var existing = Purchases.FindIndex(x => x.Id == purchase.Id || (!string.IsNullOrWhiteSpace(purchase.StripeCheckoutSessionId) && x.StripeCheckoutSessionId == purchase.StripeCheckoutSessionId));
		if (existing >= 0)
		{
			Purchases[existing] = purchase;
		}
		else
		{
			Purchases.Add(purchase);
		}

		return Task.FromResult(purchase);
	}

	public Task<List<PurchaseRecord>> GetPurchasesByUserIdAsync(string userId)
		=> Task.FromResult(Purchases.Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAt).ToList());

	public Task<List<PurchaseRecord>> ListPurchasesAsync() => Task.FromResult(Purchases.OrderByDescending(x => x.CreatedAt).ToList());

	public Task<ContactInquiry> SaveContactInquiryAsync(ContactInquiry inquiry)
	{
		var existing = Inquiries.FindIndex(x => x.Id == inquiry.Id);
		inquiry.UpdatedAt = DateTime.UtcNow;
		if (existing >= 0)
		{
			Inquiries[existing] = inquiry;
		}
		else
		{
			Inquiries.Add(inquiry);
		}

		return Task.FromResult(inquiry);
	}

	public Task<ContactInquiry?> GetContactInquiryAsync(string inquiryId)
		=> Task.FromResult(Inquiries.FirstOrDefault(x => x.Id == inquiryId));

	public Task<List<ContactInquiry>> ListContactInquiriesAsync()
		=> Task.FromResult(Inquiries.OrderByDescending(x => x.UpdatedAt).ToList());

	public Task<ContactReplyRecord> SaveContactReplyAsync(ContactReplyRecord reply)
	{
		Replies.Add(reply);
		return Task.FromResult(reply);
	}

	public Task<List<ContactReplyRecord>> GetContactRepliesAsync(string inquiryId)
		=> Task.FromResult(Replies.Where(x => x.InquiryId == inquiryId).OrderByDescending(x => x.SentAt).ToList());

	public Task<UserNoteRecord> SaveUserNoteAsync(UserNoteRecord note)
	{
		Notes.Add(note);
		return Task.FromResult(note);
	}

	public Task<List<UserNoteRecord>> GetUserNotesAsync(string userId)
		=> Task.FromResult(Notes.Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAt).ToList());

	public Task<AdminActionRecord> SaveAdminActionAsync(AdminActionRecord action)
	{
		AdminActions.Add(action);
		return Task.FromResult(action);
	}

	public Task<List<AdminActionRecord>> ListAdminActionsAsync()
		=> Task.FromResult(AdminActions.OrderByDescending(x => x.CreatedAt).ToList());

	public Task<List<AdminActionRecord>> GetAdminActionsForUserAsync(string userId)
		=> Task.FromResult(AdminActions.Where(x => x.TargetUserId == userId).OrderByDescending(x => x.CreatedAt).ToList());
}
