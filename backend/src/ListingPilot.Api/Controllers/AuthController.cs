using ListingPilot.Application.DTOs;
using ListingPilot.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ListingPilot.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("session")]
    public async Task<ActionResult<ExtendedAuthSessionDto>> GetSession()
    {
        var session = await _authService.GetSessionAsync();
        return Ok(session);
    }

    [AllowAnonymous]
    [HttpPost("signup")]
    public async Task<ActionResult<AuthResultDto>> SignUp([FromBody] SignUpRequestDto request)
    {
        return Ok(await _authService.SignUpAsync(request));
    }

    [AllowAnonymous]
    [HttpPost("confirm-email")]
    public async Task<ActionResult<AuthResultDto>> ConfirmEmail([FromBody] ConfirmEmailRequestDto request)
    {
        return Ok(await _authService.ConfirmEmailAsync(request));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResultDto>> Login([FromBody] LoginRequestDto request)
    {
        return Ok(await _authService.LoginAsync(request));
    }

    [AllowAnonymous]
    [HttpPost("admin/login")]
    public async Task<ActionResult<AuthResultDto>> AdminLogin([FromBody] LoginRequestDto request)
    {
        return Ok(await _authService.LoginAsync(request, adminOnly: true));
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResultDto>> Refresh([FromBody] RefreshSessionRequestDto request)
    {
        return Ok(await _authService.RefreshAsync(request));
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<ActionResult<AuthResultDto>> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        return Ok(await _authService.ForgotPasswordAsync(request));
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<ActionResult<AuthResultDto>> ResetPassword([FromBody] ResetPasswordRequestDto request)
    {
        return Ok(await _authService.ResetPasswordAsync(request));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request)
    {
        await _authService.LogoutAsync(request);
        return NoContent();
    }
}
