using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpPost]
    public async Task<ActionResult<ContactSubmissionResponseDto>> Submit([FromBody] ContactSubmissionRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { error = "Name and email are required." });
        }

        var response = await _contactService.SubmitContactAsync(request);
        return Ok(response);
    }
}
