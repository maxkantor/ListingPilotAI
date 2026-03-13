namespace ListingPilot.Application.DTOs;

public class CurrentUserDto
{
	public string Id { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
	public string FullName { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty;
	public string AccountState { get; set; } = string.Empty;
	public bool EmailVerified { get; set; }
	public string PlanCode { get; set; } = string.Empty;
	public int CreditBalance { get; set; }
	public int IncentiveCreditBalance { get; set; }
	public int DemoActionsUsed { get; set; }
	public int OutputGeneratedCount { get; set; }
	public string ConversionFunnelStage { get; set; } = string.Empty;
}

public class UsagePolicyDto
{
	public int AnonymousDemoOutputLimit { get; set; }
	public int AnonymousWorkflowSessions { get; set; }
	public int SignedUpStarterCredits { get; set; }
	public int FreeWorkspaceOutputLimit { get; set; }
	public bool LockResultsWhenAnonymousLimitReached { get; set; }
}

public class MonetizationPackageDto
{
	public string Id { get; set; } = string.Empty;
	public string Code { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public string BillingMode { get; set; } = string.Empty;
	public int Credits { get; set; }
	public string AccessLevel { get; set; } = string.Empty;
	public bool IncludesAdminCapabilities { get; set; }
	public bool IncludesTeamCapabilities { get; set; }
	public decimal PriceUsd { get; set; }
	public bool IsFeatured { get; set; }
	public List<string> Features { get; set; } = [];
}

public class ExtendedAuthSessionDto : AuthSessionDto
{
	public CurrentUserDto? CurrentUser { get; set; }
	public UsagePolicyDto UsagePolicy { get; set; } = new();
	public List<MonetizationPackageDto> Packages { get; set; } = [];
}

public class SignUpRequestDto
{
	public string Email { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string IntendedDestination { get; set; } = string.Empty;
}

public class LoginRequestDto
{
	public string Email { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
	public string IntendedDestination { get; set; } = string.Empty;
}

public class ConfirmEmailRequestDto
{
	public string Email { get; set; } = string.Empty;
	public string Code { get; set; } = string.Empty;
}

public class ForgotPasswordRequestDto
{
	public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequestDto
{
	public string Email { get; set; } = string.Empty;
	public string Code { get; set; } = string.Empty;
	public string NewPassword { get; set; } = string.Empty;
}

public class RefreshSessionRequestDto
{
	public string RefreshToken { get; set; } = string.Empty;
}

public class LogoutRequestDto
{
	public string AccessToken { get; set; } = string.Empty;
}

public class AuthTokenBundleDto
{
	public string AccessToken { get; set; } = string.Empty;
	public string IdToken { get; set; } = string.Empty;
	public string RefreshToken { get; set; } = string.Empty;
	public int ExpiresInSeconds { get; set; }
	public string TokenType { get; set; } = "Bearer";
}

public class AuthResultDto
{
	public bool Success { get; set; }
	public bool RequiresEmailVerification { get; set; }
	public string Message { get; set; } = string.Empty;
	public string RedirectTo { get; set; } = string.Empty;
	public AuthTokenBundleDto? Tokens { get; set; }
	public CurrentUserDto? User { get; set; }
}

public class UsageContextDto
{
	public string Scope { get; set; } = "workspace";
	public string AnonymousId { get; set; } = string.Empty;
}

public class UsageSummaryDto
{
	public string Scope { get; set; } = string.Empty;
	public int CreditBalance { get; set; }
	public int IncentiveCreditBalance { get; set; }
	public int RemainingDemoActions { get; set; }
	public int RemainingFreeOutputs { get; set; }
	public int GeneratedOutputs { get; set; }
	public bool RequiresSignup { get; set; }
	public bool RequiresPurchase { get; set; }
	public string LockReason { get; set; } = string.Empty;
}

public class UsageGateResultDto
{
	public bool Allowed { get; set; }
	public bool LockResults { get; set; }
	public string Reason { get; set; } = string.Empty;
	public string ConversionAction { get; set; } = string.Empty;
	public UsageSummaryDto Summary { get; set; } = new();
}

public class GenerateResponseEnvelopeDto
{
	public GenerateResponseDto? Result { get; set; }
	public UsageSummaryDto Usage { get; set; } = new();
}

public class CheckoutSessionRequestDto
{
	public string PackageCode { get; set; } = string.Empty;
	public string SuccessUrl { get; set; } = string.Empty;
	public string CancelUrl { get; set; } = string.Empty;
}

public class CheckoutSessionResponseDto
{
	public string CheckoutUrl { get; set; } = string.Empty;
	public string PurchaseId { get; set; } = string.Empty;
}

public class PurchaseRecordDto
{
	public string Id { get; set; } = string.Empty;
	public string PackageCode { get; set; } = string.Empty;
	public string Status { get; set; } = string.Empty;
	public decimal AmountUsd { get; set; }
	public int CreditsGranted { get; set; }
	public string ReceiptUrl { get; set; } = string.Empty;
	public string CreatedAt { get; set; } = string.Empty;
	public string CompletedAt { get; set; } = string.Empty;
}

public class ActivityEventRecordDto
{
	public string Id { get; set; } = string.Empty;
	public string EventType { get; set; } = string.Empty;
	public string UserEmail { get; set; } = string.Empty;
	public string AnonymousId { get; set; } = string.Empty;
	public string Path { get; set; } = string.Empty;
	public string Source { get; set; } = string.Empty;
	public string OccurredAt { get; set; } = string.Empty;
	public Dictionary<string, string> Metadata { get; set; } = [];
}

public class TrackEventRequestDto
{
	public string EventType { get; set; } = string.Empty;
	public string Path { get; set; } = string.Empty;
	public string Source { get; set; } = string.Empty;
	public string AnonymousId { get; set; } = string.Empty;
	public Dictionary<string, string> Metadata { get; set; } = [];
}

public class ContactInquiryDto
{
	public string Id { get; set; } = string.Empty;
	public string UserId { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
	public string Team { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty;
	public string Subject { get; set; } = string.Empty;
	public string Message { get; set; } = string.Empty;
	public string Status { get; set; } = string.Empty;
	public bool Unread { get; set; }
	public string CreatedAt { get; set; } = string.Empty;
	public string UpdatedAt { get; set; } = string.Empty;
	public string LastReplyPreview { get; set; } = string.Empty;
}

public class ContactReplyDto
{
	public string Id { get; set; } = string.Empty;
	public string InquiryId { get; set; } = string.Empty;
	public string AdminUserId { get; set; } = string.Empty;
	public string SenderEmail { get; set; } = string.Empty;
	public string RecipientEmail { get; set; } = string.Empty;
	public string Subject { get; set; } = string.Empty;
	public string MessageBody { get; set; } = string.Empty;
	public string DeliveryStatus { get; set; } = string.Empty;
	public string SentAt { get; set; } = string.Empty;
}

public class ReplyContactRequestDto
{
	public string Subject { get; set; } = string.Empty;
	public string MessageBody { get; set; } = string.Empty;
}

public class UserNoteDto
{
	public string Id { get; set; } = string.Empty;
	public string Body { get; set; } = string.Empty;
	public string AdminEmail { get; set; } = string.Empty;
	public string CreatedAt { get; set; } = string.Empty;
}

public class CreateUserNoteRequestDto
{
	public string Body { get; set; } = string.Empty;
}

public class AdminActionRecordDto
{
	public string Id { get; set; } = string.Empty;
	public string AdminEmail { get; set; } = string.Empty;
	public string ActionType { get; set; } = string.Empty;
	public string TargetUserId { get; set; } = string.Empty;
	public string TargetType { get; set; } = string.Empty;
	public string OldValueJson { get; set; } = string.Empty;
	public string NewValueJson { get; set; } = string.Empty;
	public string Notes { get; set; } = string.Empty;
	public string CreatedAt { get; set; } = string.Empty;
}

public class UpdateUserRequestDto
{
	public string PlanCode { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty;
	public string AccountState { get; set; } = string.Empty;
	public int CreditDelta { get; set; }
	public int IncentiveCreditDelta { get; set; }
	public string Notes { get; set; } = string.Empty;
}

public class UserDetailDto
{
	public CurrentUserDto User { get; set; } = new();
	public List<ActivityEventRecordDto> ActivityTimeline { get; set; } = [];
	public List<PurchaseRecordDto> Purchases { get; set; } = [];
	public List<UserNoteDto> Notes { get; set; } = [];
	public List<AdminActionRecordDto> AdminActions { get; set; } = [];
	public List<ContactInquiryDto> ContactHistory { get; set; } = [];
}

public class AdminDashboardDto
{
	public int TotalUsers { get; set; }
	public int FreeUsers { get; set; }
	public int PaidUsers { get; set; }
	public decimal ConversionRate { get; set; }
	public decimal DemoToSignupRate { get; set; }
	public decimal SignupToPaidRate { get; set; }
	public int ActiveUsers { get; set; }
	public string RevenuePlaceholder { get; set; } = string.Empty;
	public int ContactInquiriesOpen { get; set; }
	public int TotalPurchases { get; set; }
	public int DemoLimitReachedCount { get; set; }
}
