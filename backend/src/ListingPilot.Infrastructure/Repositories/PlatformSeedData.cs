using ListingPilot.Domain.Entities;

namespace ListingPilot.Infrastructure.Repositories;

internal static class PlatformSeedData
{
    public static List<ListingProject> Listings =>
    [
        new()
        {
            Id = "listing-101",
            Title = "Buckhead modern estate",
            StreetAddress = "4812 Wieuca Road NE",
            City = "Atlanta",
            State = "GA",
            Price = "$1,275,000",
            Status = "Ready to publish",
            Tone = "Luxury",
            UpdatedAt = DateTime.UtcNow.AddHours(-2),
            Tags = ["Luxury", "Pool", "Move-in ready"],
            Channels = ["MLS", "Instagram", "Email"],
            Pk = "TEAM#team-atlanta",
            Sk = "LISTING#listing-101",
            EntityType = "ListingProject",
            Gsi1Pk = "STATUS#ready",
            Gsi1Sk = DateTime.UtcNow.AddHours(-2).ToString("O"),
        },
        new()
        {
            Id = "listing-102",
            Title = "West Paces executive home",
            StreetAddress = "1180 West Paces Ferry Rd NW",
            City = "Atlanta",
            State = "GA",
            Price = "$2,450,000",
            Status = "Needs review",
            Tone = "Professional",
            UpdatedAt = DateTime.UtcNow.AddHours(-6),
            Tags = ["Executive", "Entertaining", "New launch"],
            Channels = ["MLS", "LinkedIn", "Email"],
            Pk = "TEAM#team-atlanta",
            Sk = "LISTING#listing-102",
            EntityType = "ListingProject",
            Gsi1Pk = "STATUS#review",
            Gsi1Sk = DateTime.UtcNow.AddHours(-6).ToString("O"),
        },
        new()
        {
            Id = "listing-103",
            Title = "Lake-side family property",
            StreetAddress = "220 Lake Forrest Lane",
            City = "Atlanta",
            State = "GA",
            Price = "$980,000",
            Status = "Draft",
            Tone = "Friendly",
            UpdatedAt = DateTime.UtcNow.AddDays(-1),
            Tags = ["Family", "Schools", "Outdoor"],
            Channels = ["Facebook", "Instagram"],
            Pk = "TEAM#team-atlanta",
            Sk = "LISTING#listing-103",
            EntityType = "ListingProject",
            Gsi1Pk = "STATUS#draft",
            Gsi1Sk = DateTime.UtcNow.AddDays(-1).ToString("O"),
        },
    ];

    public static List<GeneratedAsset> Assets =>
    [
        new()
        {
            Id = "asset-mls-101",
            ListingId = "listing-101",
            AssetType = "MLS Description",
            Title = "MLS description",
            Content = "Elegant Buckhead residence with five bedrooms, a chef's kitchen, spa-caliber primary suite, and refined indoor-outdoor entertaining.",
            UpdatedAt = DateTime.UtcNow.AddHours(-2),
            IsFavorite = true,
            Pk = "LISTING#listing-101",
            Sk = "ASSET#mls",
            EntityType = "GeneratedAsset",
            Gsi1Pk = "ASSETTYPE#MLS",
            Gsi1Sk = DateTime.UtcNow.AddHours(-2).ToString("O"),
        },
        new()
        {
            Id = "asset-ig-101",
            ListingId = "listing-101",
            AssetType = "Instagram Caption",
            Title = "Instagram caption",
            Content = "Buckhead luxury with natural light, chef's kitchen, and a backyard built for showings that become offers.",
            UpdatedAt = DateTime.UtcNow.AddHours(-2),
            IsFavorite = false,
            Pk = "LISTING#listing-101",
            Sk = "ASSET#instagram",
            EntityType = "GeneratedAsset",
            Gsi1Pk = "ASSETTYPE#SOCIAL",
            Gsi1Sk = DateTime.UtcNow.AddHours(-2).ToString("O"),
        },
        new()
        {
            Id = "asset-email-101",
            ListingId = "listing-101",
            AssetType = "Email Campaign",
            Title = "Email campaign",
            Content = "New to market: an executive-ready Atlanta home with premium finishes, a heated pool, and immediate showing appeal.",
            UpdatedAt = DateTime.UtcNow.AddHours(-2),
            IsFavorite = false,
            Pk = "LISTING#listing-101",
            Sk = "ASSET#email",
            EntityType = "GeneratedAsset",
            Gsi1Pk = "ASSETTYPE#EMAIL",
            Gsi1Sk = DateTime.UtcNow.AddHours(-2).ToString("O"),
        },
    ];

    public static WorkspaceSettings Settings => new()
    {
        Id = "settings-default",
        DefaultTone = "Luxury",
        TeamPreset = "Luxury launch",
        BrandVoice = "Confident, polished, premium",
        AutoSaveEnabled = true,
        RequireReview = true,
        ComplianceMode = true,
        Pk = "TEAM#team-atlanta",
        Sk = "SETTINGS#workspace",
        EntityType = "WorkspaceSettings",
    };

    public static List<UserAccount> Users =>
    [
        new() { Id = "user-1", Name = "Maya Reynolds", Email = "maya@listingpilot.ai", Plan = "Professional", Status = "Active", TeamId = "team-atlanta", TeamName = "Atlanta Luxury Group", LastActiveAt = DateTime.UtcNow.AddMinutes(-18), GenerationCount = 148, MonthlyUsage = 41, Pk = "TEAM#team-atlanta", Sk = "USER#user-1", EntityType = "UserAccount", Gsi1Pk = "PLAN#professional", Gsi1Sk = "STATUS#active" },
        new() { Id = "user-2", Name = "Chris Walker", Email = "chris@listingpilot.ai", Plan = "Agency", Status = "Active", TeamId = "team-atlanta", TeamName = "Atlanta Luxury Group", LastActiveAt = DateTime.UtcNow.AddHours(-2), GenerationCount = 212, MonthlyUsage = 74, Pk = "TEAM#team-atlanta", Sk = "USER#user-2", EntityType = "UserAccount", Gsi1Pk = "PLAN#agency", Gsi1Sk = "STATUS#active" },
        new() { Id = "user-3", Name = "Sofia Bennett", Email = "sofia@listingpilot.ai", Plan = "Trial", Status = "Trial", TeamId = "team-growth", TeamName = "ListingPilot Trials", LastActiveAt = DateTime.UtcNow.AddHours(-5), GenerationCount = 19, MonthlyUsage = 19, Pk = "TEAM#team-growth", Sk = "USER#user-3", EntityType = "UserAccount", Gsi1Pk = "PLAN#trial", Gsi1Sk = "STATUS#trial" },
    ];

    public static List<Lead> Leads =>
    [
        new() { Id = "lead-101", Name = "Avery Chen", Stage = "Demo Scheduled", Source = "Instagram Reel", PropertyAddress = "1180 West Paces Ferry Rd NW", IntentScore = "94 / 100", Owner = "Maya Reynolds", LastActivity = "Booked private tour · 2h ago", EstimatedValue = 2450000, Tags = ["Luxury", "Hot"], Notes = "Requested private showing and wants comps.", Pk = "PIPELINE#default", Sk = "LEAD#lead-101", EntityType = "Lead", Gsi1Pk = "STAGE#demo-scheduled", Gsi1Sk = DateTime.UtcNow.AddHours(-2).ToString("O") },
        new() { Id = "lead-102", Name = "Daniel Brooks", Stage = "Trial Started", Source = "Luxury Email", PropertyAddress = "4812 Wieuca Road NE", IntentScore = "76 / 100", Owner = "Maya Reynolds", LastActivity = "Opened campaign 3 times · today", EstimatedValue = 1275000, Tags = ["Email", "Warm"], Notes = "Need follow-up on school-zone questions.", Pk = "PIPELINE#default", Sk = "LEAD#lead-102", EntityType = "Lead", Gsi1Pk = "STAGE#trial-started", Gsi1Sk = DateTime.UtcNow.AddHours(-6).ToString("O") },
        new() { Id = "lead-103", Name = "Sophia Patel", Stage = "Won", Source = "Referral", PropertyAddress = "905 Peachtree Battle Ave NW", IntentScore = "98 / 100", Owner = "Chris Walker", LastActivity = "Requested comps · 34m ago", EstimatedValue = 3190000, Tags = ["Referral", "Closed"], Notes = "Moving to final paperwork.", Pk = "PIPELINE#default", Sk = "LEAD#lead-103", EntityType = "Lead", Gsi1Pk = "STAGE#won", Gsi1Sk = DateTime.UtcNow.AddMinutes(-34).ToString("O") },
    ];

    public static List<SubscriptionPlan> Plans =>
    [
        new() { Id = "plan-free", Name = "Free", MonthlyPrice = 0, MonthlyGenerationLimit = 3, TeamSeats = 1, IsFeatured = false, CtaLabel = "Start free", Pk = "PLAN", Sk = "PLAN#free", EntityType = "SubscriptionPlan" },
        new() { Id = "plan-pro", Name = "Professional", MonthlyPrice = 79, MonthlyGenerationLimit = 200, TeamSeats = 3, IsFeatured = true, CtaLabel = "Start trial", Pk = "PLAN", Sk = "PLAN#professional", EntityType = "SubscriptionPlan" },
        new() { Id = "plan-agency", Name = "Agency", MonthlyPrice = 249, MonthlyGenerationLimit = 1000, TeamSeats = 20, IsFeatured = false, CtaLabel = "Book demo", Pk = "PLAN", Sk = "PLAN#agency", EntityType = "SubscriptionPlan" },
    ];

    public static List<AuditEvent> AuditEvents =>
    [
        new() { Id = "audit-1", Actor = "System", Action = "Trial credits extended", Target = "sofia@listingpilot.ai", CreatedAt = DateTime.UtcNow.AddHours(-5), Pk = "AUDIT", Sk = "EVENT#audit-1", EntityType = "AuditEvent" },
        new() { Id = "audit-2", Actor = "Admin", Action = "Plan upgraded", Target = "Atlanta Luxury Group", CreatedAt = DateTime.UtcNow.AddDays(-1), Pk = "AUDIT", Sk = "EVENT#audit-2", EntityType = "AuditEvent" },
        new() { Id = "audit-3", Actor = "Admin", Action = "Lead owner reassigned", Target = "lead-101", CreatedAt = DateTime.UtcNow.AddDays(-2), Pk = "AUDIT", Sk = "EVENT#audit-3", EntityType = "AuditEvent" },
    ];
}
