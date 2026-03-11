using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface IGenerationService
{
    Task<GenerateResponseDto> GenerateAsync(GenerateRequestDto request);
    Task<List<HistoryItemDto>> GetHistoryAsync();
    Task<PropertyInputDto> GetSamplePropertyAsync();
}

public class GenerationService : IGenerationService
{
    private readonly IAiService _aiService;
    private readonly IGenerationRepository _repository;

    public GenerationService(IAiService aiService, IGenerationRepository repository)
    {
        _aiService = aiService;
        _repository = repository;
    }

    public async Task<GenerateResponseDto> GenerateAsync(GenerateRequestDto request)
    {
        var output = await _aiService.GenerateAsync(request.Property);

        var record = new GenerationRecord
        {
            Property = MapToEntity(request.Property),
            Output = MapToEntity(output),
        };

        var saved = await _repository.SaveAsync(record);

        return new GenerateResponseDto
        {
            Id = saved.Id,
            Output = MapToDto(saved.Output),
            CreatedAt = saved.CreatedAt,
        };
    }

    public async Task<List<HistoryItemDto>> GetHistoryAsync()
    {
        var records = await _repository.GetAllAsync();
        return records
            .Select(r => new HistoryItemDto
            {
                Id = r.Id,
                StreetAddress = r.Property.StreetAddress,
                City = r.Property.City,
                State = r.Property.State,
                Price = r.Property.Price,
                CreatedAt = r.CreatedAt,
                Output = MapToDto(r.Output),
            })
            .ToList();
    }

    public Task<PropertyInputDto> GetSamplePropertyAsync()
    {
        var sample = new PropertyInputDto
        {
            ListingUrl = "",
            StreetAddress = "4812 Wieuca Road NE",
            City = "Atlanta",
            State = "GA",
            Zip = "30342",
            Price = "1,275,000",
            Beds = "5",
            Baths = "4.5",
            SquareFeet = "4,200",
            LotSize = "0.42 acres",
            PropertyType = "Single Family",
            YearBuilt = "2019",
            Neighborhood = "Buckhead",
            KeyFeatures =
                "Chef's kitchen with quartz countertops, open concept living area, primary suite with spa bath, finished terrace level, 3-car garage, smart home technology throughout",
            InteriorFeatures =
                "Hardwood floors throughout main level, 10-ft ceilings, coffered ceilings in dining room, custom built-ins in study, gas fireplace, wine cellar",
            ExteriorFeatures =
                "Heated saltwater pool with spa, covered outdoor kitchen, level fenced backyard, professional landscaping, full irrigation system",
            SchoolInfo =
                "Sarah Smith Elementary, Sutton Middle School, North Atlanta High School (all highly rated Atlanta Public Schools)",
            AgentNotes =
                "Sellers are motivated and flexible on closing date. Home has been meticulously maintained and shows like new. One-year home warranty included.",
            TargetBuyerType = "Luxury move-up buyer, executive family, corporate relocation",
            Tone = "Luxury",
        };

        return Task.FromResult(sample);
    }

    private static Property MapToEntity(PropertyInputDto dto)
    {
        return new Property
        {
            ListingUrl = dto.ListingUrl,
            StreetAddress = dto.StreetAddress,
            City = dto.City,
            State = dto.State,
            Zip = dto.Zip,
            Price = dto.Price,
            Beds = dto.Beds,
            Baths = dto.Baths,
            SquareFeet = dto.SquareFeet,
            LotSize = dto.LotSize,
            PropertyType = dto.PropertyType,
            YearBuilt = dto.YearBuilt,
            Neighborhood = dto.Neighborhood,
            KeyFeatures = dto.KeyFeatures,
            InteriorFeatures = dto.InteriorFeatures,
            ExteriorFeatures = dto.ExteriorFeatures,
            SchoolInfo = dto.SchoolInfo,
            AgentNotes = dto.AgentNotes,
            TargetBuyerType = dto.TargetBuyerType,
            Tone = dto.Tone,
        };
    }

    private static GeneratedOutput MapToEntity(GeneratedOutputDto dto)
    {
        return new GeneratedOutput
        {
            MlsDescription = dto.MlsDescription,
            LuxuryDescription = dto.LuxuryDescription,
            FacebookPost = dto.FacebookPost,
            InstagramCaption = dto.InstagramCaption,
            LinkedInPost = dto.LinkedInPost,
            EmailBlurb = dto.EmailBlurb,
        };
    }

    private static GeneratedOutputDto MapToDto(GeneratedOutput entity)
    {
        return new GeneratedOutputDto
        {
            MlsDescription = entity.MlsDescription,
            LuxuryDescription = entity.LuxuryDescription,
            FacebookPost = entity.FacebookPost,
            InstagramCaption = entity.InstagramCaption,
            LinkedInPost = entity.LinkedInPost,
            EmailBlurb = entity.EmailBlurb,
        };
    }
}
