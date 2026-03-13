using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = "AdminOnly")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
    {
        return Ok(await _adminService.GetDashboardAsync());
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserSummaryDto>>> GetUsers()
    {
        var users = await _adminService.GetUsersAsync();
        return Ok(users);
    }

    [HttpGet("users/{userId}")]
    public async Task<ActionResult<UserDetailDto>> GetUser(string userId)
    {
        return Ok(await _adminService.GetUserDetailAsync(userId));
    }

    [HttpPatch("users/{userId}")]
    public async Task<ActionResult<CurrentUserDto>> UpdateUser(string userId, [FromBody] UpdateUserRequestDto request)
    {
        return Ok(await _adminService.UpdateUserAsync(userId, request));
    }

    [HttpPost("users/{userId}/notes")]
    public async Task<ActionResult<UserNoteDto>> AddUserNote(string userId, [FromBody] CreateUserNoteRequestDto request)
    {
        return Ok(await _adminService.AddUserNoteAsync(userId, request));
    }

    [HttpGet("leads")]
    public async Task<ActionResult<List<LeadDto>>> GetLeads()
    {
        var leads = await _adminService.GetLeadsAsync();
        return Ok(leads);
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<AdminAnalyticsDto>> GetAnalytics()
    {
        var analytics = await _adminService.GetAnalyticsAsync();
        return Ok(analytics);
    }

    [HttpGet("support")]
    public async Task<ActionResult<List<SupportTicketDto>>> GetSupport()
    {
        var tickets = await _adminService.GetSupportTicketsAsync();
        return Ok(tickets);
    }

    [HttpGet("plans")]
    public async Task<ActionResult<List<SubscriptionPlanDto>>> GetPlans()
    {
        var plans = await _adminService.GetPlansAsync();
        return Ok(plans);
    }

    [HttpGet("audit")]
    public async Task<ActionResult<List<AuditEventDto>>> GetAuditEvents()
    {
        var events = await _adminService.GetAuditEventsAsync();
        return Ok(events);
    }

    [HttpGet("contacts")]
    public async Task<ActionResult<List<ContactInquiryDto>>> GetContacts()
    {
        return Ok(await _adminService.GetContactInquiriesAsync());
    }

    [HttpGet("contacts/{inquiryId}")]
    public async Task<ActionResult<object>> GetContact(string inquiryId)
    {
        var detail = await _adminService.GetContactInquiryDetailAsync(inquiryId);
        return Ok(new { inquiry = detail.Inquiry, replies = detail.Replies });
    }
}
