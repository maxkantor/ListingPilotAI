using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;

namespace ListingPilot.Infrastructure.Repositories;

public interface IGenerationRepository
{
    Task<GenerationRecord> SaveAsync(GenerationRecord record);
    Task<List<GenerationRecord>> GetAllAsync();
    Task<GenerationRecord?> GetByIdAsync(string id);
}

public class InMemoryGenerationRepository : IGenerationRepository
{
    private static readonly List<GenerationRecord> _records = [];

    public Task<GenerationRecord> SaveAsync(GenerationRecord record)
    {
        record.Id = Guid.NewGuid().ToString();
        record.CreatedAt = DateTime.UtcNow;
        _records.Add(record);
        return Task.FromResult(record);
    }

    public Task<List<GenerationRecord>> GetAllAsync()
    {
        var sorted = _records.OrderByDescending(r => r.CreatedAt).ToList();
        return Task.FromResult(sorted);
    }

    public Task<GenerationRecord?> GetByIdAsync(string id)
    {
        return Task.FromResult(_records.FirstOrDefault(r => r.Id == id));
    }
}
