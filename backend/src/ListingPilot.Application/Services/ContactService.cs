using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface IContactService
{
    Task<ContactSubmissionResponseDto> SubmitContactAsync(ContactSubmissionRequestDto request);
    Task<ContactSubmissionResponseDto> SubmitDemoRequestAsync(DemoRequestDto request);
    Task<DemoExperienceDto> GetDemoExperienceAsync();
}

public class ContactService : IContactService
{
    private readonly IPlatformRepository _platformRepository;

    public ContactService(IPlatformRepository platformRepository)
    {
        _platformRepository = platformRepository;
    }

    public async Task<ContactSubmissionResponseDto> SubmitContactAsync(ContactSubmissionRequestDto request)
    {
        var entity = new ContactSubmission
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Email = request.Email,
            Team = request.Team,
            Role = request.Role,
            Message = request.Message,
            CreatedAt = DateTime.UtcNow,
            Pk = "CONTACT",
            Sk = $"SUBMISSION#{Guid.NewGuid()}",
            EntityType = "ContactSubmission",
            Gsi1Pk = "CONTACT#OPEN",
            Gsi1Sk = DateTime.UtcNow.ToString("O"),
        };

        var saved = await _platformRepository.SaveContactSubmissionAsync(entity);
        return new ContactSubmissionResponseDto
        {
            Id = saved.Id,
            Status = "received",
            Message = "Thanks — the ListingPilot team will respond within one business day.",
        };
    }

    public async Task<ContactSubmissionResponseDto> SubmitDemoRequestAsync(DemoRequestDto request)
    {
        var entity = new DemoRequest
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Email = request.Email,
            Team = request.Team,
            Interest = request.Interest,
            CreatedAt = DateTime.UtcNow,
            Pk = "DEMO",
            Sk = $"REQUEST#{Guid.NewGuid()}",
            EntityType = "DemoRequest",
            Gsi1Pk = "DEMO#OPEN",
            Gsi1Sk = DateTime.UtcNow.ToString("O"),
        };

        var saved = await _platformRepository.SaveDemoRequestAsync(entity);
        return new ContactSubmissionResponseDto
        {
            Id = saved.Id,
            Status = "scheduled",
            Message = "Demo request captured — we will reach out with available times shortly.",
        };
    }

    public async Task<DemoExperienceDto> GetDemoExperienceAsync()
    {
        var listings = await _platformRepository.GetListingsAsync();
        var listing = listings.First();
        var assets = await _platformRepository.GetAssetsByListingIdAsync(listing.Id);

        return new DemoExperienceDto
        {
            ListingName = listing.Title,
            Address = $"{listing.StreetAddress}, {listing.City}, {listing.State}",
            Price = listing.Price,
            Beds = "5",
            Baths = "4.5",
            HeroImageUrl = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
            Assets = assets.Select(asset => new GeneratedAssetItemDto
            {
                Id = asset.Id,
                ListingId = asset.ListingId,
                AssetType = asset.AssetType,
                Title = asset.Title,
                Content = asset.Content,
                UpdatedAt = asset.UpdatedAt,
                IsFavorite = asset.IsFavorite,
            }).ToList(),
        };
    }
}
