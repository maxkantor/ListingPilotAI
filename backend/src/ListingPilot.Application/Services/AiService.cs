using ListingPilot.Application.DTOs;

namespace ListingPilot.Application.Services;

public interface IAiService
{
    Task<GeneratedOutputDto> GenerateAsync(PropertyInputDto property);
}

public class AiService : IAiService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string? _openaiApiKey;
    private readonly string _model;
    private readonly bool _useMockMode;

    public AiService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _openaiApiKey = configuration["OpenAI:ApiKey"];
        _model = configuration["OpenAI:Model"] ?? "gpt-4.1-mini";
        _useMockMode = string.IsNullOrEmpty(_openaiApiKey);
    }

    public async Task<GeneratedOutputDto> GenerateAsync(PropertyInputDto property)
    {
        if (_useMockMode)
        {
            return GenerateMockOutput(property);
        }

        try
        {
            return await GenerateWithOpenAiAsync(property);
        }
        catch
        {
            // Fallback to mock if OpenAI fails
            return GenerateMockOutput(property);
        }
    }

    private async Task<GeneratedOutputDto> GenerateWithOpenAiAsync(PropertyInputDto property)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openaiApiKey}");

        var prompt = BuildPrompt(property);

        var requestBody = new
        {
            model = _model,
            messages = new[] { new { role = "user", content = prompt } },
            response_format = new { type = "json_object" },
            temperature = 0.45,
            max_tokens = 2000,
        };

        var content = new StringContent(
            System.Text.Json.JsonSerializer.Serialize(requestBody),
            System.Text.Encoding.UTF8,
            "application/json"
        );

        var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var result = System.Text.Json.JsonDocument.Parse(json);
        var messageContent = result.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "";

        return ParseOpenAiResponse(messageContent);
    }

    private GeneratedOutputDto GenerateMockOutput(PropertyInputDto property)
    {
        return new GeneratedOutputDto
        {
            MlsDescription = GenerateMlsDescription(property),
            LuxuryDescription = GenerateLuxuryDescription(property),
            FacebookPost = GenerateFacebookPost(property),
            InstagramCaption = GenerateInstagramCaption(property),
            LinkedInPost = GenerateLinkedInPost(property),
            EmailBlurb = GenerateEmailBlurb(property),
        };
    }

    private string GenerateMlsDescription(PropertyInputDto property)
    {
        var base_desc =
            $"Beautiful {property.PropertyType.ToLower()} located in {property.City}, {property.State}. "
            + $"This {property.Beds} bedroom, {property.Baths} bathroom property features {property.SquareFeet} sq ft. "
            + $"Price: ${property.Price}. ";

        if (!string.IsNullOrEmpty(property.YearBuilt))
            base_desc += $"Built in {property.YearBuilt}. ";

        base_desc += $"Key features: {property.KeyFeatures}. ";

        if (!string.IsNullOrEmpty(property.InteriorFeatures))
            base_desc += $"Interior: {property.InteriorFeatures}. ";

        if (!string.IsNullOrEmpty(property.ExteriorFeatures))
            base_desc += $"Exterior: {property.ExteriorFeatures}. ";

        base_desc += "Excellent location with convenient access to shopping, dining, and schools. "
            + "Ideal for families and professionals seeking a quality home. "
            + "Schedule your showing today!";

        return base_desc;
    }

    private string GenerateLuxuryDescription(PropertyInputDto property)
    {
        return
            $"Introducing an exquisite {property.PropertyType.ToLower()} in prestigious {property.City}, {property.State}. "
            + $"This architecturally impressive residence spans {property.SquareFeet} sq ft and boasts {property.Beds} refined bedrooms "
            + $"and {property.Baths} luxurious bathrooms. Listed at ${property.Price}. "
            + $"Exceptional features include: {property.KeyFeatures}. "
            + (!string.IsNullOrEmpty(property.InteriorFeatures)
                ? $"Interior appointments include {property.InteriorFeatures}. "
                : "")
            + (!string.IsNullOrEmpty(property.ExteriorFeatures)
                ? $"Outdoor living spaces showcase {property.ExteriorFeatures}. "
                : "")
            + (!string.IsNullOrEmpty(property.TargetBuyerType)
                ? $"Perfect for the {property.TargetBuyerType}. "
                : "")
            + "This prestigious property represents the pinnacle of luxury living. "
            + "An appointment to view is strongly recommended.";
    }

    private string GenerateFacebookPost(PropertyInputDto property)
    {
        return
            $"🏡 FEATURED LISTING 🏡\n\n"
            + $"Stunning {property.PropertyType} in {property.City}, {property.State}!\n"
            + $"{property.Beds} BR | {property.Baths} BA | {property.SquareFeet} sq ft\n"
            + $"Asking Price: ${property.Price}\n\n"
            + $"Highlights: {property.KeyFeatures}\n\n"
            + "Ready for your dream home? Contact us for a private showing today!\n"
            + "📞 Link in bio\n"
            + "#RealEstate #HomesForSale #PropertyListing #DreamHome #RealEstateAgent";
    }

    private string GenerateInstagramCaption(PropertyInputDto property)
    {
        return
            $"✨ Introducing this gorgeous {property.PropertyType.ToLower()} in {property.City}! "
            + $"{property.Beds}BR • {property.Baths}BA • {property.SquareFeet} sq ft\n\n"
            + $"Featuring: {property.KeyFeatures}\n\n"
            + "Ready to find your dream home? DM us for more details! 📸🔑\n"
            + "#RealEstate #Luxury #PropertyListing #HomesForSale #RealEstateLife #DreamHome";
    }

    private string GenerateLinkedInPost(PropertyInputDto property)
    {
        return
            $"Thrilled to present this exceptional {property.PropertyType} in {property.City}, {property.State}. "
            + $"Our team is proud to showcase this premium {property.Beds} bedroom residence featuring {property.SquareFeet} sq ft "
            + $"of sophisticated living space. Priced at ${property.Price}. "
            + $"Key highlights include: {property.KeyFeatures}. "
            + "Leveraging our expertise in the luxury residential market, we're committed to helping our clients find their ideal property. "
            + "Interested in learning more? Let's connect.";
    }

    private string GenerateEmailBlurb(PropertyInputDto property)
    {
        return
            $"Subject: Exclusive Property Opportunity\n\n"
            + $"Dear Valued Client,\n\n"
            + $"We're delighted to offer this exceptional {property.PropertyType} in {property.City}, {property.State}. "
            + $"Features {property.Beds} bedrooms, {property.Baths} bathrooms, and {property.SquareFeet} sq ft of premium living space. "
            + $"Asking price: ${property.Price}.\n\n"
            + $"This home showcases: {property.KeyFeatures}\n\n"
            + "Schedule your private tour at your earliest convenience.\n\n"
            + "Best Regards,\nYour Real Estate Team";
    }

    private string BuildPrompt(PropertyInputDto property)
    {
        return
            $@"Generate professional real estate marketing copy for the following property. 
IMPORTANT: Use ONLY the information provided. Do NOT invent details, neighborhood facts, schools, or commute times.
Do NOT include discriminatory language. Keep copy credible and grounded.
Return clean JSON only.

Property Details:
- Type: {property.PropertyType}
- Address: {property.StreetAddress}, {property.City}, {property.State} {property.Zip}
- Price: ${property.Price}
- Beds: {property.Beds} | Baths: {property.Baths} | Sq Ft: {property.SquareFeet}
{(string.IsNullOrEmpty(property.LotSize) ? "" : $"- Lot Size: {property.LotSize}\n")}
{(string.IsNullOrEmpty(property.YearBuilt) ? "" : $"- Year Built: {property.YearBuilt}\n")}
{(string.IsNullOrEmpty(property.Neighborhood) ? "" : $"- Neighborhood: {property.Neighborhood}\n")}
- Key Features: {property.KeyFeatures}
{(string.IsNullOrEmpty(property.InteriorFeatures) ? "" : $"- Interior: {property.InteriorFeatures}\n")}
{(string.IsNullOrEmpty(property.ExteriorFeatures) ? "" : $"- Exterior: {property.ExteriorFeatures}\n")}
{(string.IsNullOrEmpty(property.SchoolInfo) ? "" : $"- Schools: {property.SchoolInfo}\n")}
{(string.IsNullOrEmpty(property.AgentNotes) ? "" : $"- Agent Notes: {property.AgentNotes}\n")}
{(string.IsNullOrEmpty(property.TargetBuyerType) ? "" : $"- Target Buyer: {property.TargetBuyerType}\n")}
- Tone: {property.Tone}

Generate six separate pieces of copy:
1. MLS Description (concise, feature-focused, 150-200 words)
2. Luxury Description (elevated tone, premium wording, 150-200 words)
3. Facebook Post (engaging, social-appropriate, with hashtags)
4. Instagram Caption (social-friendly, 100-150 chars, with hashtags)
5. LinkedIn Post (professional, B2B appropriate, 150-200 words)
6. Email Blurb (short, newsletter-ready, 80-120 words)

Format the response as JSON with keys: mls_description, luxury_description, facebook_post, instagram_caption, linkedin_post, email_blurb.
Avoid markdown fences, commentary, or any additional prose outside the JSON object.";
    }

    private GeneratedOutputDto ParseOpenAiResponse(string content)
    {
        try
        {
            var doc = System.Text.Json.JsonDocument.Parse(content);
            var root = doc.RootElement;

            return new GeneratedOutputDto
            {
                MlsDescription = root.TryGetProperty("mls_description", out var prop1)
                    ? prop1.GetString() ?? ""
                    : "",
                LuxuryDescription = root.TryGetProperty("luxury_description", out var prop2)
                    ? prop2.GetString() ?? ""
                    : "",
                FacebookPost = root.TryGetProperty("facebook_post", out var prop3)
                    ? prop3.GetString() ?? ""
                    : "",
                InstagramCaption = root.TryGetProperty("instagram_caption", out var prop4)
                    ? prop4.GetString() ?? ""
                    : "",
                LinkedInPost = root.TryGetProperty("linkedin_post", out var prop5)
                    ? prop5.GetString() ?? ""
                    : "",
                EmailBlurb = root.TryGetProperty("email_blurb", out var prop6)
                    ? prop6.GetString() ?? ""
                    : "",
            };
        }
        catch
        {
            // Return empty if parsing fails
            return new GeneratedOutputDto();
        }
    }
}
