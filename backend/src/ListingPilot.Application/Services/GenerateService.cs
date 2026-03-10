using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Domain.Interfaces;

namespace ListingPilot.Application.Services;

public class GenerateService : IGenerateService
{
    private readonly IAiService _aiService;

    public GenerateService(IAiService aiService)
    {
        _aiService = aiService;
    }

    public async Task<GeneratedContentDto> GenerateAsync(PropertyInputDto dto)
    {
        var listing = MapToListing(dto);
        var result = await _aiService.GenerateContentAsync(listing);
        return MapToDto(result);
    }

    private static PropertyListing MapToListing(PropertyInputDto dto) => new()
    {
        ListingUrl = dto.ListingUrl,
        StreetAddress = dto.StreetAddress,
        City = dto.City,
        State = dto.State,
        Zip = dto.Zip,
        Price = dto.Price,
        Beds = dto.Beds,
        Baths = dto.Baths,
        Sqft = dto.Sqft,
        LotSize = dto.LotSize,
        PropertyType = dto.PropertyType,
        YearBuilt = dto.YearBuilt,
        Neighborhood = dto.Neighborhood,
        KeyFeatures = dto.KeyFeatures,
        InteriorFeatures = dto.InteriorFeatures,
        ExteriorFeatures = dto.ExteriorFeatures,
        SchoolInfo = dto.SchoolInfo,
        AgentNotes = dto.AgentNotes,
        TargetBuyer = dto.TargetBuyer,
        Tone = dto.Tone
    };

    private static GeneratedContentDto MapToDto(GenerationResult result) => new()
    {
        MlsDescription = result.MlsDescription,
        LuxuryDescription = result.LuxuryDescription,
        FacebookPost = result.FacebookPost,
        InstagramCaption = result.InstagramCaption,
        LinkedInPost = result.LinkedInPost,
        EmailBlurb = result.EmailBlurb
    };
}
