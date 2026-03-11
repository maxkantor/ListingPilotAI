using Amazon.Lambda.AspNetCoreServer.Hosting;
using ListingPilot.Application.Services;
using ListingPilot.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

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
builder.Services.AddSingleton<IGenerationRepository, InMemoryGenerationRepository>();
builder.Services.AddSingleton<IPlatformRepository, InMemoryPlatformRepository>();

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Frontend:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://localhost:5173"];

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
app.UseAuthorization();
app.MapControllers();

// Lambda support: use HttpRequestHandler for Lambda
if (!app.Environment.IsDevelopment())
{
    app.UsePathBase("/api");
}

await app.RunAsync();
