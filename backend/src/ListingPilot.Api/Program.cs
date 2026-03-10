using ListingPilot.Application.Services;
using ListingPilot.Domain.Interfaces;
using ListingPilot.Infrastructure.AI;
using ListingPilot.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// CORS — allow all origins in development
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// AI service selection: use OpenAI if key is present, otherwise use mock
var openAiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
    ?? builder.Configuration["OpenAI:ApiKey"];

if (!string.IsNullOrWhiteSpace(openAiKey))
{
    builder.Services.AddHttpClient();
    builder.Services.AddTransient<IAiService>(sp =>
    {
        var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
        var httpClient = httpClientFactory.CreateClient();
        httpClient.Timeout = TimeSpan.FromSeconds(60);
        return new OpenAiService(httpClient, openAiKey);
    });
}
else
{
    builder.Services.AddSingleton<IAiService, MockAiService>();
}

builder.Services.AddSingleton<IHistoryRepository, InMemoryHistoryRepository>();
builder.Services.AddScoped<IGenerateService, GenerateService>();

var app = builder.Build();

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
