namespace ListingPilot.Domain.Entities;

public abstract class DynamoEntity
{
    public string Pk { get; set; } = string.Empty;
    public string Sk { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string? Gsi1Pk { get; set; }
    public string? Gsi1Sk { get; set; }
}

public class UserAccount : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Plan { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string TeamId { get; set; } = string.Empty;
    public string TeamName { get; set; } = string.Empty;
    public DateTime LastActiveAt { get; set; }
    public int GenerationCount { get; set; }
    public int MonthlyUsage { get; set; }
}

public class Team : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Segment { get; set; } = string.Empty;
    public int SeatCount { get; set; }
}

public class ListingProject : DynamoEntity
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

public class GeneratedAsset : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string ListingId { get; set; } = string.Empty;
    public string AssetType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public bool IsFavorite { get; set; }
}

public class Lead : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string PropertyAddress { get; set; } = string.Empty;
    public string IntentScore { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public string LastActivity { get; set; } = string.Empty;
    public decimal EstimatedValue { get; set; }
    public List<string> Tags { get; set; } = [];
    public string Notes { get; set; } = string.Empty;
}

public class ContactSubmission : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class DemoRequest : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Interest { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AdminNote : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string TargetType { get; set; } = string.Empty;
    public string TargetId { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UsageEvent : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string EventName { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class SubscriptionPlan : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public int MonthlyGenerationLimit { get; set; }
    public int TeamSeats { get; set; }
    public bool IsFeatured { get; set; }
    public string CtaLabel { get; set; } = string.Empty;
}

public class AuditEvent : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string Actor { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class WorkspaceSettings : DynamoEntity
{
    public string Id { get; set; } = string.Empty;
    public string DefaultTone { get; set; } = string.Empty;
    public string TeamPreset { get; set; } = string.Empty;
    public string BrandVoice { get; set; } = string.Empty;
    public bool AutoSaveEnabled { get; set; }
    public bool RequireReview { get; set; }
    public bool ComplianceMode { get; set; }
}
