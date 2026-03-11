using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/history")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;
    private readonly ILogger<HistoryController> _logger;

    public HistoryController(IHistoryService historyService, ILogger<HistoryController> logger)
    {
        _historyService = historyService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<HistoryItemDto>>> GetHistory()
    {
        try
        {
            var history = await _historyService.GetHistoryAsync();
            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving generation history");
            return StatusCode(500, new { error = "Failed to retrieve history" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<object>> SaveHistory([FromBody] HistoryItemDto item)
    {
        var id = await _historyService.SaveHistoryAsync(item);
        return Ok(new { id });
    }
}