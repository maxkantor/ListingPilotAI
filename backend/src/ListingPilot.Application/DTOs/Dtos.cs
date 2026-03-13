namespace ListingPilot.Application.DTOs;

public class PropertyInputDto
{
    public string ListingUrl { get; set; } = string.Empty;
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string Beds { get; set; } = string.Empty;
    public string Baths { get; set; } = string.Empty;
    public string SquareFeet { get; set; } = string.Empty;
    public string? LotSize { get; set; }
    public string PropertyType { get; set; } = "Single Family";
    public string? YearBuilt { get; set; }
    public string? Neighborhood { get; set; }
    public string KeyFeatures { get; set; } = string.Empty;
    public string? InteriorFeatures { get; set; }
    public string? ExteriorFeatures { get; set; }
    public string? SchoolInfo { get; set; }
    public string? AgentNotes { get; set; }
    public string? TargetBuyerType { get; set; }
    public string Tone { get; set; } = "Professional";
}

public class GenerateRequestDto
{
    public PropertyInputDto Property { get; set; } = new();
    public UsageContextDto? UsageContext { get; set; }
}

public class GeneratedOutputDto
{
    public string MlsDescription { get; set; } = string.Empty;
    public string LuxuryDescription { get; set; } = string.Empty;
    public string FacebookPost { get; set; } = string.Empty;
    public string InstagramCaption { get; set; } = string.Empty;
    public string LinkedInPost { get; set; } = string.Empty;
    public string EmailBlurb { get; set; } = string.Empty;
}

public class GenerateResponseDto
{
    public string Id { get; set; } = string.Empty;
    public GeneratedOutputDto Output { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class HistoryItemDto
{
    public string Id { get; set; } = string.Empty;
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public GeneratedOutputDto Output { get; set; } = new();
}

public class DashboardSummaryDto
{
    public int ActiveListings { get; set; }
    public int OutputsGenerated { get; set; }
    public string AvgTurnaround { get; set; } = string.Empty;
    public string PipelineValue { get; set; } = string.Empty;
    public string ConversionLift { get; set; } = string.Empty;
    public List<string> PriorityActions { get; set; } = [];
    public List<ChannelPerformanceDto> TopChannels { get; set; } = [];
}

public class ChannelPerformanceDto
{
    public string Channel { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string ConversionRate { get; set; } = string.Empty;
    public string EngagementLift { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class PerformanceSnapshotDto
{
    public string Week { get; set; } = string.Empty;
    public int Outputs { get; set; }
    public int QualifiedLeads { get; set; }
    public int ToursBooked { get; set; }
}

public class LeadDto
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
}

public class LeadStageSummaryDto
{
    public string Stage { get; set; } = string.Empty;
    public int Count { get; set; }
    public string Value { get; set; } = string.Empty;
}

public class AdminOverviewDto
{
    public int ActiveAgents { get; set; }
    public int TrialAccounts { get; set; }
    public string MonthlyRecurringRevenue { get; set; } = string.Empty;
    public string ChurnRisk { get; set; } = string.Empty;
    public int OpenSupportTickets { get; set; }
    public List<LeadStageSummaryDto> Pipeline { get; set; } = [];
    public List<string> Alerts { get; set; } = [];
}

public class AnalyticsOverviewDto
{
    public string OrganicTrafficGrowth { get; set; } = string.Empty;
    public string DemoConversionRate { get; set; } = string.Empty;
    public string TrialActivationRate { get; set; } = string.Empty;
    public string TopLandingPage { get; set; } = string.Empty;
    public List<string> SeoPriorities { get; set; } = [];
}
