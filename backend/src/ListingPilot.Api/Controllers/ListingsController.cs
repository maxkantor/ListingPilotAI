using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/listings")]
public class ListingsController : ControllerBase
{
    private readonly IListingsService _listingsService;

    public ListingsController(IListingsService listingsService)
    {
        _listingsService = listingsService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ListingProjectDto>>> GetListings()
    {
        var listings = await _listingsService.GetListingsAsync();
        return Ok(listings);
    }

    [HttpGet("{listingId}/assets")]
    public async Task<ActionResult<List<GeneratedAssetItemDto>>> GetListingAssets(string listingId)
    {
        var assets = await _listingsService.GetListingAssetsAsync(listingId);
        return Ok(assets);
    }
}
