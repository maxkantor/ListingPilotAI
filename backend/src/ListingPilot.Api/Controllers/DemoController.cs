using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/demo")]
public class DemoController : ControllerBase
{
    private readonly IContactService _contactService;

    public DemoController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    public async Task<ActionResult<DemoExperienceDto>> GetDemoExperience()
    {
        var demo = await _contactService.GetDemoExperienceAsync();
        return Ok(demo);
    }

    [HttpPost]
    public async Task<ActionResult<ContactSubmissionResponseDto>> RequestDemo([FromBody] DemoRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { error = "Name and email are required." });
        }

        var response = await _contactService.SubmitDemoRequestAsync(request);
        return Ok(response);
    }
}
