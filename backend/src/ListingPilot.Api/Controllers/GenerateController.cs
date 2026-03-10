using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenerateController : ControllerBase
{
    private readonly IGenerateService _generateService;

    public GenerateController(IGenerateService generateService)
    {
        _generateService = generateService;
    }

    [HttpPost]
    public async Task<ActionResult<GeneratedContentDto>> Generate([FromBody] PropertyInputDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _generateService.GenerateAsync(dto);
        return Ok(result);
    }
}
