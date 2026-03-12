using ListingPilot.Application.DTOs;
using System.Security.Claims;

namespace ListingPilot.Application.Services;

public interface IAuthService
{
    Task<AuthSessionDto> GetSessionAsync();
}

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public Task<AuthSessionDto> GetSessionAsync()
    {
        var userPoolId = _configuration["Auth:CognitoUserPoolId"] ?? string.Empty;
        var clientId = _configuration["Auth:CognitoClientId"] ?? string.Empty;
        var region = _configuration["Auth:CognitoRegion"] ?? "us-east-1";
        var principal = _httpContextAccessor.HttpContext?.User;
        var isAuthenticated = principal?.Identity?.IsAuthenticated ?? false;
        var groups = principal?
            .FindAll("cognito:groups")
            .Select(claim => claim.Value)
            .ToList() ?? [];

        return Task.FromResult(new AuthSessionDto
        {
            AuthEnabled = !string.IsNullOrWhiteSpace(userPoolId),
            IdentityMode = string.IsNullOrWhiteSpace(userPoolId)
                ? "launch-preview"
                : isAuthenticated ? "cognito-authenticated" : "cognito",
            CognitoRegion = region,
            UserPoolId = userPoolId,
            ClientId = clientId,
            IsAuthenticated = isAuthenticated,
            CurrentUserId = principal?.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal?.FindFirstValue("sub") ?? string.Empty,
            CurrentUserEmail = principal?.FindFirstValue(ClaimTypes.Email) ?? principal?.FindFirstValue("email") ?? string.Empty,
            CurrentUserName = principal?.FindFirstValue("name") ?? principal?.Identity?.Name ?? string.Empty,
            Groups = groups,
            AllowedFeatures = groups.Count > 0
                ? ["role-based access", "team workspaces", "cognito-backed session"]
                : ["magic-link-ready", "role-based access", "team workspaces"],
        });
    }
}
