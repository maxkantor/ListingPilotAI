using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly IActivityService _activityService;

    public EventsController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    [AllowAnonymous]
    [HttpPost("track")]
    public async Task<IActionResult> Track([FromBody] TrackEventRequestDto request)
    {
        await _activityService.TrackAsync(
            request.EventType,
            request.Metadata,
            request.Source,
            request.Path,
            request.AnonymousId);

        return Accepted();
    }
}
