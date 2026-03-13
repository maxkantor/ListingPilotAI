using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/billing")]
public class BillingController : ControllerBase
{
    private readonly IBillingService _billingService;

    public BillingController(IBillingService billingService)
    {
        _billingService = billingService;
    }

    [AllowAnonymous]
    [HttpGet("packages")]
    public async Task<ActionResult<List<MonetizationPackageDto>>> GetPackages()
    {
        return Ok(await _billingService.GetPackagesAsync());
    }

    [Authorize]
    [HttpGet("purchases")]
    public async Task<ActionResult<List<PurchaseRecordDto>>> GetPurchases()
    {
        return Ok(await _billingService.GetMyPurchasesAsync());
    }

    [Authorize]
    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutSessionResponseDto>> Checkout([FromBody] CheckoutSessionRequestDto request)
    {
        return Ok(await _billingService.CreateCheckoutSessionAsync(request));
    }

    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        using var reader = new StreamReader(Request.Body);
        var payload = await reader.ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].ToString();
        await _billingService.HandleWebhookAsync(payload, signature);
        return Ok();
    }
}
