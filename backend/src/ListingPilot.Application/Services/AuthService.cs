using ListingPilot.Application.DTOs;

namespace ListingPilot.Application.Services;

public interface IAuthService
{
    Task<AuthSessionDto> GetSessionAsync();
}

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<AuthSessionDto> GetSessionAsync()
    {
        var userPoolId = _configuration["Auth:CognitoUserPoolId"] ?? string.Empty;
        var region = _configuration["Auth:CognitoRegion"] ?? "us-east-1";

        return Task.FromResult(new AuthSessionDto
        {
            AuthEnabled = !string.IsNullOrWhiteSpace(userPoolId),
            IdentityMode = string.IsNullOrWhiteSpace(userPoolId) ? "launch-preview" : "cognito",
            CognitoRegion = region,
            UserPoolId = userPoolId,
            AllowedFeatures = ["magic-link-ready", "role-based access", "team workspaces"],
        });
    }
}
