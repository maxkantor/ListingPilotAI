using Microsoft.AspNetCore.Mvc;
using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;

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

    [HttpPost("generate")]
    public async Task<ActionResult<GenerateResponseDto>> Generate([FromBody] GenerateRequestDto request)
    {
        try
        {
            if (request?.Property == null)
                return BadRequest("Property data is required");

            var result = await _generationService.GenerateAsync(request);
            return Ok(result);
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

    [HttpGet("history")]
    public async Task<ActionResult<List<HistoryItemDto>>> GetHistory()
    {
        try
        {
            var history = await _generationService.GetHistoryAsync();
            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving history");
            return StatusCode(500, new { error = "Failed to retrieve history" });
        }
    }

    [HttpPost("history")]
    public ActionResult SaveHistory([FromBody] HistoryItemDto item)
    {
        // MVP: history is auto-saved on generation, this is optional
        return Ok(new { id = item.Id });
    }

    [HttpGet("health")]
    public ActionResult Health()
    {
        return Ok(new { status = "healthy" });
    }
}
