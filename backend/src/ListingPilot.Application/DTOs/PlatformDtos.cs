namespace ListingPilot.Application.DTOs;

public class AuthSessionDto
{
    public bool AuthEnabled { get; set; }
    public string IdentityMode { get; set; } = string.Empty;
    public string CognitoRegion { get; set; } = string.Empty;
    public string UserPoolId { get; set; } = string.Empty;
    public List<string> AllowedFeatures { get; set; } = [];
}

public class ListingProjectDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Tone { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public List<string> Tags { get; set; } = [];
    public List<string> Channels { get; set; } = [];
}

public class GeneratedAssetItemDto
{
    public string Id { get; set; } = string.Empty;
    public string ListingId { get; set; } = string.Empty;
    public string AssetType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public bool IsFavorite { get; set; }
}

public class WorkspaceSettingsDto
{
    public string DefaultTone { get; set; } = string.Empty;
    public string TeamPreset { get; set; } = string.Empty;
    public string BrandVoice { get; set; } = string.Empty;
    public bool AutoSaveEnabled { get; set; }
    public bool RequireReview { get; set; }
    public bool ComplianceMode { get; set; }
}

public class UserSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Plan { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string TeamName { get; set; } = string.Empty;
    public string LastActiveAt { get; set; } = string.Empty;
    public int GenerationCount { get; set; }
    public int MonthlyUsage { get; set; }
}

public class AdminAnalyticsDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int TrialUsers { get; set; }
    public int PaidUsers { get; set; }
    public int TotalGenerations { get; set; }
    public int TotalLeads { get; set; }
    public string FunnelSummary { get; set; } = string.Empty;
    public string MrrPlaceholder { get; set; } = string.Empty;
}

public class SupportTicketDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}

public class SubscriptionPlanDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public int MonthlyGenerationLimit { get; set; }
    public int TeamSeats { get; set; }
    public bool IsFeatured { get; set; }
    public string CtaLabel { get; set; } = string.Empty;
}

public class AuditEventDto
{
    public string Id { get; set; } = string.Empty;
    public string Actor { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}

public class ContactSubmissionRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class ContactSubmissionResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class DemoRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Interest { get; set; } = string.Empty;
}

public class DemoExperienceDto
{
    public string ListingName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string Beds { get; set; } = string.Empty;
    public string Baths { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;
    public List<GeneratedAssetItemDto> Assets { get; set; } = [];
}
