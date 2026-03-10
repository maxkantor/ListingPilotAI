using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Interfaces;

namespace ListingPilot.Infrastructure.Repositories;

public class InMemoryHistoryRepository : IHistoryRepository
{
    private readonly List<HistoryRecord> _records = new();

    public Task<IEnumerable<HistoryRecord>> GetAllAsync()
    {
        var ordered = _records.OrderByDescending(r => r.CreatedAt).AsEnumerable();
        return Task.FromResult(ordered);
    }

    public Task SaveAsync(HistoryRecord record)
    {
        _records.Insert(0, record);
        return Task.CompletedTask;
    }
}
