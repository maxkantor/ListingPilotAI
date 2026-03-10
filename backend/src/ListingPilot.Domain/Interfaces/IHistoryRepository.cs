using ListingPilot.Domain.Entities;

namespace ListingPilot.Domain.Interfaces;

public class HistoryRecord
{
    public string Id { get; set; } = string.Empty;
    public PropertyListing Property { get; set; } = new();
    public GenerationResult Content { get; set; } = new();
    public string CreatedAt { get; set; } = string.Empty;
}

public interface IHistoryRepository
{
    Task<IEnumerable<HistoryRecord>> GetAllAsync();
    Task SaveAsync(HistoryRecord record);
}
