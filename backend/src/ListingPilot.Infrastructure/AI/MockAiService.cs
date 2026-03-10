using ListingPilot.Domain.Entities;
using ListingPilot.Domain.Interfaces;

namespace ListingPilot.Infrastructure.AI;

public class MockAiService : IAiService
{
    public Task<GenerationResult> GenerateContentAsync(PropertyListing p)
    {
        var neighborhood = string.IsNullOrWhiteSpace(p.Neighborhood) ? p.City : p.Neighborhood;
        var yearBuilt = string.IsNullOrWhiteSpace(p.YearBuilt) ? "recently built" : $"built in {p.YearBuilt}";
        var lotInfo = string.IsNullOrWhiteSpace(p.LotSize) ? string.Empty : $" on {p.LotSize} lot";
        var keyFeatures = string.IsNullOrWhiteSpace(p.KeyFeatures) ? "premium features" : p.KeyFeatures;
        var interior = string.IsNullOrWhiteSpace(p.InteriorFeatures) ? "high-end finishes" : p.InteriorFeatures;
        var exterior = string.IsNullOrWhiteSpace(p.ExteriorFeatures) ? "beautifully landscaped grounds" : p.ExteriorFeatures;
        var schools = string.IsNullOrWhiteSpace(p.SchoolInfo) ? "top-rated schools nearby" : p.SchoolInfo;
        var targetBuyer = string.IsNullOrWhiteSpace(p.TargetBuyer) ? "discerning buyers" : p.TargetBuyer.ToLower();

        var result = new GenerationResult
        {
            MlsDescription = BuildMlsDescription(p, neighborhood, yearBuilt, lotInfo, keyFeatures, interior, exterior, schools),
            LuxuryDescription = BuildLuxuryDescription(p, neighborhood, yearBuilt, lotInfo, interior, exterior),
            FacebookPost = BuildFacebookPost(p, neighborhood, keyFeatures),
            InstagramCaption = BuildInstagramCaption(p, neighborhood),
            LinkedInPost = BuildLinkedInPost(p, neighborhood, targetBuyer),
            EmailBlurb = BuildEmailBlurb(p, neighborhood, keyFeatures)
        };

        return Task.FromResult(result);
    }

    private static string BuildMlsDescription(PropertyListing p, string neighborhood, string yearBuilt,
        string lotInfo, string keyFeatures, string interior, string exterior, string schools)
    {
        return $"Welcome to {p.StreetAddress}, a stunning {p.Beds}-bed, {p.Baths}-bath {p.PropertyType.ToLower()} " +
               $"nestled in the heart of {neighborhood}, {p.City}, {p.State}. " +
               $"{p.Sqft} sq ft of thoughtfully designed living space{lotInfo}, {yearBuilt}. " +
               $"This exceptional home features {keyFeatures.ToLower()}. " +
               $"Inside, you'll find {interior.ToLower()}. " +
               $"The exterior showcases {exterior.ToLower()}. " +
               $"Served by {schools}. " +
               $"Offered at {p.Price}. Schedule your private showing today — this one won't last long.";
    }

    private static string BuildLuxuryDescription(PropertyListing p, string neighborhood, string yearBuilt,
        string lotInfo, string interior, string exterior)
    {
        return $"An extraordinary residence awaits at {p.StreetAddress} — where refined living meets " +
               $"unparalleled craftsmanship in the prestigious {neighborhood} community of {p.City}, {p.State}. " +
               $"This magnificent {p.PropertyType.ToLower()}, {yearBuilt}, presents {p.Beds} lavish bedrooms " +
               $"and {p.Baths} spa-inspired baths across {p.Sqft} square feet of distinguished living{lotInfo}. " +
               $"Every detail has been curated for the most discerning buyer: {interior.ToLower()}. " +
               $"The grounds deliver a private sanctuary — {exterior.ToLower()}. " +
               $"Offered exclusively at {p.Price}. This is more than a home; it is a legacy.";
    }

    private static string BuildFacebookPost(PropertyListing p, string neighborhood, string keyFeatures)
    {
        return $"🏡 Just Listed in {neighborhood}, {p.City}, {p.State}!\n\n" +
               $"📍 {p.StreetAddress}\n" +
               $"💰 {p.Price} | {p.Beds} Beds | {p.Baths} Baths | {p.Sqft} Sq Ft\n\n" +
               $"This incredible {p.PropertyType.ToLower()} has everything you've been searching for: " +
               $"{keyFeatures.ToLower()}.\n\n" +
               $"Whether you're a growing family or looking to upgrade your lifestyle, this home checks every box. " +
               $"Tour it before it's gone!\n\n" +
               $"📞 DM me or drop a comment below to schedule a private showing. " +
               $"Serious inquiries only — homes like this move fast.\n\n" +
               $"#JustListed #{p.City.Replace(" ", "")}RealEstate #{p.State}Homes #DreamHome #ForSale";
    }

    private static string BuildInstagramCaption(PropertyListing p, string neighborhood)
    {
        return $"✨ New to Market ✨\n\n" +
               $"{p.StreetAddress} | {p.City}, {p.State}\n" +
               $"{p.Price} • {p.Beds}BD / {p.Baths}BA • {p.Sqft} sqft\n\n" +
               $"Swipe to see inside this stunning {p.PropertyType.ToLower()} in {neighborhood}. " +
               $"From the moment you walk in, you'll feel right at home.\n\n" +
               $"Link in bio to schedule your tour 🔑\n\n" +
               $"#{p.City.Replace(" ", "")} #{p.State}RealEstate #JustListed #HouseHunting " +
               $"#RealEstateAgent #NewListing #HomeSweetHome #PropertyGoals #RealtorLife";
    }

    private static string BuildLinkedInPost(PropertyListing p, string neighborhood, string targetBuyer)
    {
        return $"New Listing Alert — {p.StreetAddress}, {p.City}, {p.State} {p.Zip}\n\n" +
               $"Excited to bring this exceptional {p.PropertyType.ToLower()} to market in {neighborhood}. " +
               $"At {p.Price}, this {p.Beds}/{p.Baths} property spanning {p.Sqft} square feet represents " +
               $"strong value in today's {p.City} market.\n\n" +
               $"This listing is particularly well-suited for {targetBuyer} seeking quality, location, and long-term value.\n\n" +
               $"If you or someone in your network is actively searching in the {p.City} area, " +
               $"I'd welcome a conversation. My clients receive full-service representation and market-informed guidance.\n\n" +
               $"#RealEstate #{p.City.Replace(" ", "")} #NewListing #PropertyInvestment #RealEstateProfessional";
    }

    private static string BuildEmailBlurb(PropertyListing p, string neighborhood, string keyFeatures)
    {
        return $"Subject: New Listing — {p.StreetAddress}, {p.City}, {p.State} | {p.Price}\n\n" +
               $"Hi [First Name],\n\n" +
               $"I wanted to share a new listing that just hit the market and may be exactly what you're looking for.\n\n" +
               $"{p.StreetAddress} in {neighborhood} is a beautifully appointed {p.Beds}-bed, {p.Baths}-bath " +
               $"{p.PropertyType.ToLower()} offering {p.Sqft} sq ft of living space at {p.Price}.\n\n" +
               $"Highlights include: {keyFeatures.ToLower()}.\n\n" +
               $"Properties in {neighborhood} are moving quickly right now. " +
               $"I'd love to schedule a showing at your convenience — please reply to this email or call me directly.\n\n" +
               $"Best regards,\n[Agent Name]\n[Brokerage] | [Phone]";
    }
}
