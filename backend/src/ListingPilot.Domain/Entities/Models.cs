namespace ListingPilot.Domain.Entities;

public class Property
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

public class GeneratedOutput
{
    public string MlsDescription { get; set; } = string.Empty;
    public string LuxuryDescription { get; set; } = string.Empty;
    public string FacebookPost { get; set; } = string.Empty;
    public string InstagramCaption { get; set; } = string.Empty;
    public string LinkedInPost { get; set; } = string.Empty;
    public string EmailBlurb { get; set; } = string.Empty;
}

public class GenerationRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public Property Property { get; set; } = new();
    public GeneratedOutput Output { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
