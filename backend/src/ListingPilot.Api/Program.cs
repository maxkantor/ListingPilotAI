using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.DynamoDBv2;
using Amazon.Lambda.AspNetCoreServer.Hosting;
using Amazon.SimpleEmail;
using Amazon.SimpleSystemsManagement;
using ListingPilot.Application.Services;
using ListingPilot.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var cognitoUserPoolId = builder.Configuration["Auth:CognitoUserPoolId"] ?? builder.Configuration["Auth__CognitoUserPoolId"];
var cognitoClientId = builder.Configuration["Auth:CognitoClientId"] ?? builder.Configuration["Auth__CognitoClientId"];
var cognitoRegion = builder.Configuration["Auth:CognitoRegion"] ?? builder.Configuration["Auth__CognitoRegion"] ?? builder.Configuration["AWS:Region"] ?? builder.Configuration["AWS__Region"] ?? "us-east-1";
var dynamoTableName = builder.Configuration["DynamoDb:TableName"] ?? builder.Configuration["GENERATION_TABLE_NAME"];
var storageProvider = builder.Configuration["Storage:Provider"] ?? builder.Configuration["Storage__Provider"] ?? (string.IsNullOrWhiteSpace(dynamoTableName) ? "memory" : "dynamodb");
var useDynamoDb = storageProvider.Equals("dynamodb", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(dynamoTableName);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();

var awsRegionEndpoint = RegionEndpoint.GetBySystemName(cognitoRegion);
builder.Services.AddSingleton<IAmazonCognitoIdentityProvider>(_ => new AmazonCognitoIdentityProviderClient(awsRegionEndpoint));
builder.Services.AddSingleton<IAmazonSimpleEmailService>(_ => new AmazonSimpleEmailServiceClient(awsRegionEndpoint));
builder.Services.AddSingleton<IAmazonSimpleSystemsManagement>(_ => new AmazonSimpleSystemsManagementClient(awsRegionEndpoint));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        if (!string.IsNullOrWhiteSpace(cognitoUserPoolId))
        {
            options.Authority = $"https://cognito-idp.{cognitoRegion}.amazonaws.com/{cognitoUserPoolId}";
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = !string.IsNullOrWhiteSpace(cognitoClientId),
                ValidAudience = cognitoClientId,
                NameClaimType = "name",
                RoleClaimType = "cognito:groups",
            };
        }
        else
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = false,
                RoleClaimType = "cognito:groups",
            };
        }
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim("cognito:groups", "admin")
            || context.User.HasClaim("custom:role", "admin")
            || context.User.HasClaim(System.Security.Claims.ClaimTypes.Role, "admin")
            || context.User.HasClaim(System.Security.Claims.ClaimTypes.Email, builder.Configuration["Admin:BootstrapEmail"] ?? builder.Configuration["Admin__BootstrapEmail"] ?? "mykantor@bellsouth.net")
            || context.User.HasClaim("email", builder.Configuration["Admin:BootstrapEmail"] ?? builder.Configuration["Admin__BootstrapEmail"] ?? "mykantor@bellsouth.net")));
});

// HttpClient for OpenAI integration
builder.Services.AddHttpClient();

// Register application services
builder.Services.AddScoped<IAiService, AiService>();
builder.Services.AddScoped<IGenerationService, GenerationService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddScoped<IListingsService, ListingsService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRequestContextService, RequestContextService>();
builder.Services.AddScoped<IPlatformSecretsService, PlatformSecretsService>();
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IUsagePolicyService, UsagePolicyService>();
builder.Services.AddScoped<IBillingService, BillingService>();

if (useDynamoDb)
{
    builder.Services.AddSingleton<IAmazonDynamoDB>(_ => new AmazonDynamoDBClient());
    builder.Services.AddSingleton<IGenerationRepository, DynamoDbGenerationRepository>();
    builder.Services.AddSingleton<IPlatformRepository, DynamoDbPlatformRepository>();
    builder.Services.AddSingleton<ICommerceRepository, DynamoDbCommerceRepository>();
}
else
{
    builder.Services.AddSingleton<IGenerationRepository, InMemoryGenerationRepository>();
    builder.Services.AddSingleton<IPlatformRepository, InMemoryPlatformRepository>();
    builder.Services.AddSingleton<ICommerceRepository, InMemoryCommerceRepository>();
}

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Frontend:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://localhost:5173", "http://localhost:4173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});

var app = builder.Build();

// Middleware
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Lambda support: use HttpRequestHandler for Lambda
if (!app.Environment.IsDevelopment())
{
    app.UsePathBase("/api");
}

await app.RunAsync();
