using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Authorization;
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

    [AllowAnonymous]
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

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("{inquiryId}/reply")]
    public async Task<ActionResult<ContactReplyDto>> Reply(string inquiryId, [FromBody] ReplyContactRequestDto request)
    {
        return Ok(await _contactService.ReplyAsync(inquiryId, request));
    }
}
