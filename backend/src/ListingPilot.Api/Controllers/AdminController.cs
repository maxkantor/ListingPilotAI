using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserSummaryDto>>> GetUsers()
    {
        var users = await _adminService.GetUsersAsync();
        return Ok(users);
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
}
