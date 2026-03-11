using ListingPilot.Application.DTOs;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface IListingsService
{
    Task<List<ListingProjectDto>> GetListingsAsync();
    Task<List<GeneratedAssetItemDto>> GetListingAssetsAsync(string listingId);
}

public class ListingsService : IListingsService
{
    private readonly IPlatformRepository _platformRepository;

    public ListingsService(IPlatformRepository platformRepository)
    {
        _platformRepository = platformRepository;
    }

    public async Task<List<ListingProjectDto>> GetListingsAsync()
    {
        var listings = await _platformRepository.GetListingsAsync();
        return listings.Select(listing => new ListingProjectDto
        {
            Id = listing.Id,
            Title = listing.Title,
            StreetAddress = listing.StreetAddress,
            City = listing.City,
            State = listing.State,
            Price = listing.Price,
            Status = listing.Status,
            Tone = listing.Tone,
            UpdatedAt = listing.UpdatedAt,
            Tags = listing.Tags,
            Channels = listing.Channels,
        }).ToList();
    }

    public async Task<List<GeneratedAssetItemDto>> GetListingAssetsAsync(string listingId)
    {
        var assets = await _platformRepository.GetAssetsByListingIdAsync(listingId);
        return assets.Select(asset => new GeneratedAssetItemDto
        {
            Id = asset.Id,
            ListingId = asset.ListingId,
            AssetType = asset.AssetType,
            Title = asset.Title,
            Content = asset.Content,
            UpdatedAt = asset.UpdatedAt,
            IsFavorite = asset.IsFavorite,
        }).ToList();
    }
}
