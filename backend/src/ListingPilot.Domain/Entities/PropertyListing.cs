namespace ListingPilot.Domain.Entities;

public class PropertyListing
{
    public string? ListingUrl { get; set; }
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string Beds { get; set; } = string.Empty;
    public string Baths { get; set; } = string.Empty;
    public string Sqft { get; set; } = string.Empty;
    public string? LotSize { get; set; }
    public string PropertyType { get; set; } = string.Empty;
    public string? YearBuilt { get; set; }
    public string? Neighborhood { get; set; }
    public string? KeyFeatures { get; set; }
    public string? InteriorFeatures { get; set; }
    public string? ExteriorFeatures { get; set; }
    public string? SchoolInfo { get; set; }
    public string? AgentNotes { get; set; }
    public string? TargetBuyer { get; set; }
    public string Tone { get; set; } = "Professional";
}
