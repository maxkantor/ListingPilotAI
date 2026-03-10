using ListingPilot.Domain.Entities;

namespace ListingPilot.Domain.Interfaces;

public interface IAiService
{
    Task<GenerationResult> GenerateContentAsync(PropertyListing property);
}
