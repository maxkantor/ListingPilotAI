namespace ListingPilot.Application.DTOs;

public class HistoryEntryDto
{
    public string Id { get; set; } = string.Empty;
    public PropertyInputDto Property { get; set; } = new();
    public GeneratedContentDto Content { get; set; } = new();
    public string CreatedAt { get; set; } = string.Empty;
}
