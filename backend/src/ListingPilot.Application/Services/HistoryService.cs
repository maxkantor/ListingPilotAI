using ListingPilot.Application.DTOs;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface IHistoryService
{
    Task<List<HistoryItemDto>> GetHistoryAsync();
    Task<string> SaveHistoryAsync(HistoryItemDto item);
}

public class HistoryService : IHistoryService
{
    private readonly IGenerationRepository _generationRepository;

    public HistoryService(IGenerationRepository generationRepository)
    {
        _generationRepository = generationRepository;
    }

    public async Task<List<HistoryItemDto>> GetHistoryAsync()
    {
        var records = await _generationRepository.GetAllAsync();

        return records
            .Select(r => new HistoryItemDto
            {
                Id = r.Id,
                StreetAddress = r.Property.StreetAddress,
                City = r.Property.City,
                State = r.Property.State,
                Price = r.Property.Price,
                CreatedAt = r.CreatedAt,
                Output = new GeneratedOutputDto
                {
                    MlsDescription = r.Output.MlsDescription,
                    LuxuryDescription = r.Output.LuxuryDescription,
                    FacebookPost = r.Output.FacebookPost,
                    InstagramCaption = r.Output.InstagramCaption,
                    LinkedInPost = r.Output.LinkedInPost,
                    EmailBlurb = r.Output.EmailBlurb,
                },
            })
            .ToList();
    }

    public Task<string> SaveHistoryAsync(HistoryItemDto item)
    {
        return Task.FromResult(item.Id);
    }
}