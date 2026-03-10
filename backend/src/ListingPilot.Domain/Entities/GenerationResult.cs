namespace ListingPilot.Domain.Entities;

public class GenerationResult
{
    public string MlsDescription { get; set; } = string.Empty;
    public string LuxuryDescription { get; set; } = string.Empty;
    public string FacebookPost { get; set; } = string.Empty;
    public string InstagramCaption { get; set; } = string.Empty;
    public string LinkedInPost { get; set; } = string.Empty;
    public string EmailBlurb { get; set; } = string.Empty;
}
