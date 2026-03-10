using ListingPilot.Application.DTOs;

namespace ListingPilot.Application.Services;

public interface IGenerateService
{
    Task<GeneratedContentDto> GenerateAsync(PropertyInputDto property);
}
