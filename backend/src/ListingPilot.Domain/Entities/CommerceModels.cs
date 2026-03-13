namespace ListingPilot.Domain.Entities;

public static class PlatformRoles
{
	public const string User = "user";
	public const string Admin = "admin";
}

public static class AccountStates
{
	public const string Active = "active";
	public const string Suspended = "suspended";
	public const string Disabled = "disabled";
	public const string Invited = "invited";
}

public static class PurchaseStatuses
{
	public const string Pending = "pending";
	public const string Completed = "completed";
	public const string Failed = "failed";
	public const string Refunded = "refunded";
}

public static class InquiryStatuses
{
	public const string New = "new";
	public const string Open = "open";
	public const string Replied = "replied";
	public const string Closed = "closed";
}

public static class ActivityEventTypes
{
	public const string PageView = "page_view";
	public const string DemoStarted = "demo_started";
	public const string DemoActionUsed = "demo_action_used";
	public const string DemoLimitReached = "demo_limit_reached";
	public const string SignupStarted = "signup_started";
	public const string SignupCompleted = "signup_completed";
	public const string EmailVerified = "email_verified";
	public const string Login = "login";
	public const string Logout = "logout";
	public const string OutputGenerated = "output_generated";
	public const string CreditConsumed = "credit_consumed";
	public const string PackageViewed = "package_viewed";
	public const string PackagePurchased = "package_purchased";
	public const string PlanChanged = "plan_changed";
	public const string CheckoutSessionCreated = "checkout_session_created";
	public const string CheckoutCompleted = "checkout_completed";
	public const string PaymentFailed = "payment_failed";
	public const string PackageGranted = "package_granted";
	public const string CreditsUpdated = "credits_updated";
	public const string RefundProcessed = "refund_processed";
	public const string ContactSubmitted = "contact_submitted";
	public const string ContactReplied = "contact_replied";
	public const string AdminLogin = "admin_login";
	public const string AdminAction = "admin_action";
}

public class UsagePolicyConfig : DynamoEntity
{
	public string Id { get; set; } = "usage-policy";
	public int AnonymousDemoOutputLimit { get; set; } = 2;
	public int AnonymousWorkflowSessions { get; set; } = 1;
	public int SignedUpStarterCredits { get; set; } = 5;
	public int FreeWorkspaceOutputLimit { get; set; } = 5;
	public bool LockResultsWhenAnonymousLimitReached { get; set; } = true;
}

public class MonetizationPackage : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string Code { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public string BillingMode { get; set; } = "one_time";
	public int Credits { get; set; }
	public string AccessLevel { get; set; } = "starter";
	public bool IncludesAdminCapabilities { get; set; }
	public bool IncludesTeamCapabilities { get; set; }
	public decimal PriceUsd { get; set; }
	public string Currency { get; set; } = "usd";
	public bool IsFeatured { get; set; }
	public string StripePriceLookupKey { get; set; } = string.Empty;
	public List<string> Features { get; set; } = [];
}

public class UserProfile : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string CognitoUsername { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string FullName { get; set; } = string.Empty;
	public string Role { get; set; } = PlatformRoles.User;
	public string AccountState { get; set; } = AccountStates.Active;
	public bool EmailVerified { get; set; }
	public bool IsAdmin { get; set; }
	public string PlanCode { get; set; } = "free";
	public int CreditBalance { get; set; }
	public int IncentiveCreditBalance { get; set; }
	public int DemoActionsUsed { get; set; }
	public int DemoSessionsUsed { get; set; }
	public int OutputGeneratedCount { get; set; }
	public int PackagePurchaseCount { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? LastActivityAt { get; set; }
	public DateTime? LastLoginAt { get; set; }
	public string StripeCustomerId { get; set; } = string.Empty;
	public string ConversionFunnelStage { get; set; } = "visitor";
	public string TeamName { get; set; } = string.Empty;
	public string NotesSummary { get; set; } = string.Empty;
}

public class UsageLedger : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string SubjectType { get; set; } = string.Empty;
	public string SubjectId { get; set; } = string.Empty;
	public string Scope { get; set; } = string.Empty;
	public int DemoActionsUsed { get; set; }
	public int DemoSessionsUsed { get; set; }
	public int CreditsConsumed { get; set; }
	public int GeneratedOutputs { get; set; }
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class PurchaseRecord : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string UserId { get; set; } = string.Empty;
	public string UserEmail { get; set; } = string.Empty;
	public string PackageCode { get; set; } = string.Empty;
	public string Status { get; set; } = PurchaseStatuses.Pending;
	public string StripeCheckoutSessionId { get; set; } = string.Empty;
	public string StripePaymentIntentId { get; set; } = string.Empty;
	public string StripeCustomerId { get; set; } = string.Empty;
	public decimal AmountUsd { get; set; }
	public string Currency { get; set; } = "usd";
	public int CreditsGranted { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? CompletedAt { get; set; }
	public string InvoiceId { get; set; } = string.Empty;
	public string ReceiptUrl { get; set; } = string.Empty;
	public string RawMetadataJson { get; set; } = string.Empty;
}

public class ActivityEventRecord : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string EventType { get; set; } = string.Empty;
	public string UserId { get; set; } = string.Empty;
	public string UserEmail { get; set; } = string.Empty;
	public string AnonymousId { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty;
	public string Path { get; set; } = string.Empty;
	public string Source { get; set; } = string.Empty;
	public string IpAddress { get; set; } = string.Empty;
	public string UserAgent { get; set; } = string.Empty;
	public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
	public Dictionary<string, string> Metadata { get; set; } = [];
}

public class ContactInquiry : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string UserId { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
	public string Team { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty;
	public string Subject { get; set; } = string.Empty;
	public string Message { get; set; } = string.Empty;
	public string Status { get; set; } = InquiryStatuses.New;
	public bool Unread { get; set; } = true;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
	public string LastReplyPreview { get; set; } = string.Empty;
}

public class ContactReplyRecord : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string InquiryId { get; set; } = string.Empty;
	public string AdminUserId { get; set; } = string.Empty;
	public string SenderEmail { get; set; } = string.Empty;
	public string RecipientEmail { get; set; } = string.Empty;
	public string Subject { get; set; } = string.Empty;
	public string MessageBody { get; set; } = string.Empty;
	public string DeliveryStatus { get; set; } = string.Empty;
	public string SesMessageId { get; set; } = string.Empty;
	public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

public class UserNoteRecord : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string UserId { get; set; } = string.Empty;
	public string AdminUserId { get; set; } = string.Empty;
	public string AdminEmail { get; set; } = string.Empty;
	public string Body { get; set; } = string.Empty;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class AdminActionRecord : DynamoEntity
{
	public string Id { get; set; } = string.Empty;
	public string AdminUserId { get; set; } = string.Empty;
	public string AdminEmail { get; set; } = string.Empty;
	public string ActionType { get; set; } = string.Empty;
	public string TargetUserId { get; set; } = string.Empty;
	public string TargetType { get; set; } = string.Empty;
	public string OldValueJson { get; set; } = string.Empty;
	public string NewValueJson { get; set; } = string.Empty;
	public string Notes { get; set; } = string.Empty;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
