using Microsoft.AspNetCore.Mvc;
using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Authorization;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api")]
public class GenerationController : ControllerBase
{
    private readonly IGenerationService _generationService;
    private readonly ILogger<GenerationController> _logger;

    public GenerationController(IGenerationService generationService, ILogger<GenerationController> logger)
    {
        _generationService = generationService;
        _logger = logger;
    }

    [AllowAnonymous]
    [HttpPost("generate")]
    public async Task<ActionResult<GenerateResponseEnvelopeDto>> Generate([FromBody] GenerateRequestDto request)
    {
        try
        {
            if (request?.Property == null)
                return BadRequest("Property data is required");

            var result = await _generationService.GenerateAsync(request);
            return Ok(result);
        }
        catch (UsageGateException ex)
        {
            return StatusCode(StatusCodes.Status402PaymentRequired, ex.GateResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating copy");
            return StatusCode(500, new { error = "Failed to generate copy. Please try again." });
        }
    }

    [HttpGet("sample-property")]
    public async Task<ActionResult<PropertyInputDto>> GetSampleProperty()
    {
        var sample = await _generationService.GetSamplePropertyAsync();
        return Ok(sample);
    }

    [Authorize]
    [HttpGet("dashboard/summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary()
    {
        var summary = await _generationService.GetDashboardSummaryAsync();
        return Ok(summary);
    }

    [Authorize]
    [HttpGet("dashboard/performance")]
    public async Task<ActionResult<List<PerformanceSnapshotDto>>> GetDashboardPerformance()
    {
        var performance = await _generationService.GetPerformanceSnapshotsAsync();
        return Ok(performance);
    }

    [Authorize]
    [HttpGet("crm/leads")]
    public async Task<ActionResult<List<LeadDto>>> GetLeads()
    {
        var leads = await _generationService.GetLeadsAsync();
        return Ok(leads);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("admin/overview")]
    public async Task<ActionResult<AdminOverviewDto>> GetAdminOverview()
    {
        var overview = await _generationService.GetAdminOverviewAsync();
        return Ok(overview);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("analytics/overview")]
    public async Task<ActionResult<AnalyticsOverviewDto>> GetAnalyticsOverview()
    {
        var overview = await _generationService.GetAnalyticsOverviewAsync();
        return Ok(overview);
    }

    [HttpGet("health")]
    public ActionResult Health()
    {
        return Ok(new { status = "healthy" });
    }
}
