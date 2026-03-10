using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ListingPilot.Domain.Entities;
using ListingPilot.Domain.Interfaces;

namespace ListingPilot.Infrastructure.AI;

public class OpenAiService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string Model = "gpt-4o-mini";

    public OpenAiService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<GenerationResult> GenerateContentAsync(PropertyListing p)
    {
        var systemPrompt = """
            You are an expert real estate marketing copywriter. Your job is to create compelling, 
            fair-housing-compliant marketing content for residential property listings. 
            Focus on the property's features — never describe neighborhoods using demographic characteristics.
            Use the tone specified by the agent. Avoid clichés and generic filler. Be specific and compelling.
            """;

        var userPrompt = BuildUserPrompt(p);

        var requestBody = new
        {
            model = Model,
            temperature = 0.7,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseJson);
        var messageContent = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? string.Empty;

        return ParseResponse(messageContent);
    }

    private static string BuildUserPrompt(PropertyListing p)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"Generate 6 marketing pieces for this property. Tone: {p.Tone}.");
        sb.AppendLine();
        sb.AppendLine($"Property: {p.StreetAddress}, {p.City}, {p.State} {p.Zip}");
        sb.AppendLine($"Price: {p.Price} | Type: {p.PropertyType} | Beds: {p.Beds} | Baths: {p.Baths} | Sqft: {p.Sqft}");
        if (!string.IsNullOrWhiteSpace(p.LotSize)) sb.AppendLine($"Lot: {p.LotSize}");
        if (!string.IsNullOrWhiteSpace(p.YearBuilt)) sb.AppendLine($"Year Built: {p.YearBuilt}");
        if (!string.IsNullOrWhiteSpace(p.Neighborhood)) sb.AppendLine($"Neighborhood: {p.Neighborhood}");
        if (!string.IsNullOrWhiteSpace(p.KeyFeatures)) sb.AppendLine($"Key Features: {p.KeyFeatures}");
        if (!string.IsNullOrWhiteSpace(p.InteriorFeatures)) sb.AppendLine($"Interior: {p.InteriorFeatures}");
        if (!string.IsNullOrWhiteSpace(p.ExteriorFeatures)) sb.AppendLine($"Exterior: {p.ExteriorFeatures}");
        if (!string.IsNullOrWhiteSpace(p.SchoolInfo)) sb.AppendLine($"Schools: {p.SchoolInfo}");
        if (!string.IsNullOrWhiteSpace(p.AgentNotes)) sb.AppendLine($"Agent Notes: {p.AgentNotes}");
        if (!string.IsNullOrWhiteSpace(p.TargetBuyer)) sb.AppendLine($"Target Buyer: {p.TargetBuyer}");
        sb.AppendLine();
        sb.AppendLine("Return ONLY valid JSON with exactly these keys:");
        sb.AppendLine("""{"mlsDescription":"...","luxuryDescription":"...","facebookPost":"...","instagramCaption":"...","linkedInPost":"...","emailBlurb":"..."}""");

        return sb.ToString();
    }

    private static GenerationResult ParseResponse(string content)
    {
        try
        {
            var start = content.IndexOf('{');
            var end = content.LastIndexOf('}');
            if (start >= 0 && end > start)
                content = content[start..(end + 1)];

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            return new GenerationResult
            {
                MlsDescription = root.TryGetProperty("mlsDescription", out var mls) ? mls.GetString() ?? "" : "",
                LuxuryDescription = root.TryGetProperty("luxuryDescription", out var lux) ? lux.GetString() ?? "" : "",
                FacebookPost = root.TryGetProperty("facebookPost", out var fb) ? fb.GetString() ?? "" : "",
                InstagramCaption = root.TryGetProperty("instagramCaption", out var ig) ? ig.GetString() ?? "" : "",
                LinkedInPost = root.TryGetProperty("linkedInPost", out var li) ? li.GetString() ?? "" : "",
                EmailBlurb = root.TryGetProperty("emailBlurb", out var email) ? email.GetString() ?? "" : ""
            };
        }
        catch
        {
            return new GenerationResult
            {
                MlsDescription = content,
                LuxuryDescription = "Unable to parse AI response.",
                FacebookPost = "Unable to parse AI response.",
                InstagramCaption = "Unable to parse AI response.",
                LinkedInPost = "Unable to parse AI response.",
                EmailBlurb = "Unable to parse AI response."
            };
        }
    }
}
