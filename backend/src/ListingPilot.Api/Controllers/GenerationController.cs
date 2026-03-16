using Microsoft.AspNetCore.Mvc;
using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api")]
public class GenerationController : ControllerBase
{
    private readonly IGenerationService _generationService;
    private readonly ILogger<GenerationController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public GenerationController(IGenerationService generationService, ILogger<GenerationController> logger, IHttpClientFactory httpClientFactory)
    {
        _generationService = generationService;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
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

    [AllowAnonymous]
    [HttpGet("listing-preview")]
    public async Task<ActionResult<object>> GetListingPreview([FromQuery] string url)
    {
        if (string.IsNullOrWhiteSpace(url) || !Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return BadRequest(new { error = "A valid listing URL is required." });
        }

        if (!uri.Host.Contains("zillow.com", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { error = "Only Zillow URLs are currently supported." });
        }

        try
        {
            using var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(8);
            client.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
            client.DefaultRequestHeaders.Accept.ParseAdd("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            client.DefaultRequestHeaders.AcceptLanguage.ParseAdd("en-US,en;q=0.9");

            var html = await client.GetStringAsync(uri);

            var price = ExtractFirstGroup(html,
                "\"price\"\\s*:\\s*\"?([0-9][0-9,]*)\"?",
                "\"priceForHDP\"\\s*:\\s*\"?([0-9][0-9,]*)\"?",
                "\"unformattedPrice\"\\s*:\\s*([0-9][0-9,]*)");

            var beds = ExtractFirstGroup(html,
                "\"bedrooms\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)",
                "\"beds\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)");

            var baths = ExtractFirstGroup(html,
                "\"bathrooms\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)",
                "\"baths\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)");

            var squareFeet = ExtractFirstGroup(html,
                "\"livingArea\"\\s*:\\s*([0-9][0-9,]*)",
                "\"livingAreaValue\"\\s*:\\s*([0-9][0-9,]*)",
                "\"sqft\"\\s*:\\s*([0-9][0-9,]*)");

            var streetAddress = ExtractFirstGroup(html,
                "\"streetAddress\"\\s*:\\s*\"([^\"]+)\"");

            var city = ExtractFirstGroup(html,
                "\"addressLocality\"\\s*:\\s*\"([^\"]+)\"");

            var state = ExtractFirstGroup(html,
                "\"addressRegion\"\\s*:\\s*\"([A-Za-z]{2})\"")?.ToUpperInvariant();

            var zip = ExtractFirstGroup(html,
                "\"postalCode\"\\s*:\\s*\"([0-9]{5}(?:-[0-9]{4})?)\"");

            return Ok(new
            {
                streetAddress,
                city,
                state,
                zip,
                price = NormalizeDigits(price),
                beds = NormalizeDecimal(beds),
                baths = NormalizeDecimal(baths),
                squareFeet = NormalizeDigits(squareFeet),
            });
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Unable to fetch listing preview for URL {Url}", url);
            return Ok(new { });
        }
    }

    private static string? ExtractFirstGroup(string input, params string[] patterns)
    {
        foreach (var pattern in patterns)
        {
            var match = Regex.Match(input, pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline);
            if (match.Success && match.Groups.Count > 1)
            {
                var value = match.Groups[1].Value
                    .Replace("\\u002F", "/", StringComparison.OrdinalIgnoreCase)
                    .Replace("\\u0026", "&", StringComparison.OrdinalIgnoreCase)
                    .Replace("\\u0027", "'", StringComparison.OrdinalIgnoreCase)
                    .Replace("\\\"", "\"", StringComparison.OrdinalIgnoreCase)
                    .Trim();

                if (!string.IsNullOrWhiteSpace(value))
                {
                    return value;
                }
            }
        }

        return null;
    }

    private static string? NormalizeDigits(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var digits = Regex.Replace(value, "[^0-9]", string.Empty);
        if (string.IsNullOrWhiteSpace(digits))
        {
            return null;
        }

        if (!decimal.TryParse(digits, out var numeric))
        {
            return null;
        }

        return numeric.ToString("N0");
    }

    private static string? NormalizeDecimal(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var cleaned = Regex.Replace(value, "[^0-9.]", string.Empty);
        if (string.IsNullOrWhiteSpace(cleaned))
        {
            return null;
        }

        return cleaned;
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
