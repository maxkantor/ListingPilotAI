using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/history")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryRepository _historyRepository;

    public HistoryController(IHistoryRepository historyRepository)
    {
        _historyRepository = historyRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HistoryEntryDto>>> GetHistory()
    {
        var records = await _historyRepository.GetAllAsync();
        var dtos = records.Select(r => new HistoryEntryDto
        {
            Id = r.Id,
            CreatedAt = r.CreatedAt,
            Property = MapPropertyDto(r.Property),
            Content = MapContentDto(r.Content)
        });
        return Ok(dtos);
    }

    [HttpPost]
    public async Task<IActionResult> SaveHistory([FromBody] HistoryEntryDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var record = new HistoryRecord
        {
            Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            CreatedAt = string.IsNullOrWhiteSpace(dto.CreatedAt) ? DateTime.UtcNow.ToString("O") : dto.CreatedAt,
            Property = MapPropertyEntity(dto.Property),
            Content = MapContentEntity(dto.Content)
        };

        await _historyRepository.SaveAsync(record);
        return Created($"/api/history/{record.Id}", null);
    }

    private static PropertyInputDto MapPropertyDto(ListingPilot.Domain.Entities.PropertyListing p) => new()
    {
        ListingUrl = p.ListingUrl,
        StreetAddress = p.StreetAddress,
        City = p.City,
        State = p.State,
        Zip = p.Zip,
        Price = p.Price,
        Beds = p.Beds,
        Baths = p.Baths,
        Sqft = p.Sqft,
        LotSize = p.LotSize,
        PropertyType = p.PropertyType,
        YearBuilt = p.YearBuilt,
        Neighborhood = p.Neighborhood,
        KeyFeatures = p.KeyFeatures,
        InteriorFeatures = p.InteriorFeatures,
        ExteriorFeatures = p.ExteriorFeatures,
        SchoolInfo = p.SchoolInfo,
        AgentNotes = p.AgentNotes,
        TargetBuyer = p.TargetBuyer,
        Tone = p.Tone
    };

    private static GeneratedContentDto MapContentDto(ListingPilot.Domain.Entities.GenerationResult r) => new()
    {
        MlsDescription = r.MlsDescription,
        LuxuryDescription = r.LuxuryDescription,
        FacebookPost = r.FacebookPost,
        InstagramCaption = r.InstagramCaption,
        LinkedInPost = r.LinkedInPost,
        EmailBlurb = r.EmailBlurb
    };

    private static ListingPilot.Domain.Entities.PropertyListing MapPropertyEntity(PropertyInputDto dto) => new()
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

    private static ListingPilot.Domain.Entities.GenerationResult MapContentEntity(GeneratedContentDto dto) => new()
    {
        MlsDescription = dto.MlsDescription,
        LuxuryDescription = dto.LuxuryDescription,
        FacebookPost = dto.FacebookPost,
        InstagramCaption = dto.InstagramCaption,
        LinkedInPost = dto.LinkedInPost,
        EmailBlurb = dto.EmailBlurb
    };
}
