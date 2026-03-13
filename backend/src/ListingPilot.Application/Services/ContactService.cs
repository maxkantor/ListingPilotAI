using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface IContactService
{
    Task<ContactSubmissionResponseDto> SubmitContactAsync(ContactSubmissionRequestDto request);
    Task<ContactSubmissionResponseDto> SubmitDemoRequestAsync(DemoRequestDto request);
    Task<DemoExperienceDto> GetDemoExperienceAsync();
    Task<List<ContactInquiryDto>> GetInquiriesAsync();
    Task<(ContactInquiryDto Inquiry, List<ContactReplyDto> Replies)> GetInquiryDetailAsync(string inquiryId);
    Task<ContactReplyDto> ReplyAsync(string inquiryId, ReplyContactRequestDto request);
}

public class ContactService : IContactService
{
    private readonly IPlatformRepository _platformRepository;
    private readonly ICommerceRepository _commerceRepository;
    private readonly IRequestContextService _requestContextService;
    private readonly IPlatformSecretsService _platformSecretsService;
    private readonly IActivityService _activityService;
    private readonly IAmazonSimpleEmailService _emailService;

    public ContactService(
        IPlatformRepository platformRepository,
        ICommerceRepository commerceRepository,
        IRequestContextService requestContextService,
        IPlatformSecretsService platformSecretsService,
        IActivityService activityService,
        IAmazonSimpleEmailService emailService)
    {
        _platformRepository = platformRepository;
        _commerceRepository = commerceRepository;
        _requestContextService = requestContextService;
        _platformSecretsService = platformSecretsService;
        _activityService = activityService;
        _emailService = emailService;
    }

    public async Task<ContactSubmissionResponseDto> SubmitContactAsync(ContactSubmissionRequestDto request)
    {
        var now = DateTime.UtcNow;
        var inquiry = new ContactInquiry
        {
            Id = Guid.NewGuid().ToString("N"),
            UserId = _requestContextService.GetCurrent().UserId,
            Name = request.Name,
            Email = request.Email,
            Team = request.Team,
            Role = request.Role,
            Subject = string.IsNullOrWhiteSpace(request.Team) ? "Website contact inquiry" : $"Contact inquiry · {request.Team}",
            Message = request.Message,
            Status = InquiryStatuses.New,
            Unread = true,
            CreatedAt = now,
            UpdatedAt = now,
            Pk = $"CONTACT#{Guid.NewGuid():N}",
            Sk = "INQUIRY",
            EntityType = nameof(ContactInquiry),
            Gsi1Pk = $"INQUIRY_STATUS#{InquiryStatuses.New}",
            Gsi1Sk = now.ToString("O"),
        };

        await _commerceRepository.SaveContactInquiryAsync(inquiry);
        await _activityService.TrackAsync(ActivityEventTypes.ContactSubmitted, new() { ["inquiryId"] = inquiry.Id, ["email"] = inquiry.Email }, userId: inquiry.UserId, userEmail: inquiry.Email);

        var legacyEntity = new ContactSubmission
        {
            Id = inquiry.Id,
            Name = request.Name,
            Email = request.Email,
            Team = request.Team,
            Role = request.Role,
            Message = request.Message,
            CreatedAt = now,
            Pk = "CONTACT",
            Sk = $"SUBMISSION#{inquiry.Id}",
            EntityType = "ContactSubmission",
            Gsi1Pk = "CONTACT#OPEN",
            Gsi1Sk = now.ToString("O"),
        };
        await _platformRepository.SaveContactSubmissionAsync(legacyEntity);

        return new ContactSubmissionResponseDto
        {
            Id = inquiry.Id,
            Status = "received",
            Message = "Thanks — the ListingPilot team will respond within one business day.",
        };
    }

    public async Task<ContactSubmissionResponseDto> SubmitDemoRequestAsync(DemoRequestDto request)
    {
        var entity = new DemoRequest
        {
            Id = Guid.NewGuid().ToString("N"),
            Name = request.Name,
            Email = request.Email,
            Team = request.Team,
            Interest = request.Interest,
            CreatedAt = DateTime.UtcNow,
            Pk = "DEMO",
            Sk = $"REQUEST#{Guid.NewGuid():N}",
            EntityType = nameof(DemoRequest),
            Gsi1Pk = "DEMO#OPEN",
            Gsi1Sk = DateTime.UtcNow.ToString("O"),
        };

        var saved = await _platformRepository.SaveDemoRequestAsync(entity);
        await _activityService.TrackAsync(ActivityEventTypes.DemoStarted, new() { ["demoRequestId"] = saved.Id, ["email"] = saved.Email });

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

    public async Task<List<ContactInquiryDto>> GetInquiriesAsync()
    {
        var inquiries = await _commerceRepository.ListContactInquiriesAsync();
        return inquiries.Select(MapInquiry).ToList();
    }

    public async Task<(ContactInquiryDto Inquiry, List<ContactReplyDto> Replies)> GetInquiryDetailAsync(string inquiryId)
    {
        var inquiry = await _commerceRepository.GetContactInquiryAsync(inquiryId)
            ?? throw new InvalidOperationException("Inquiry not found.");
        var replies = await _commerceRepository.GetContactRepliesAsync(inquiryId);
        return (MapInquiry(inquiry), replies.Select(MapReply).ToList());
    }

    public async Task<ContactReplyDto> ReplyAsync(string inquiryId, ReplyContactRequestDto request)
    {
        var inquiry = await _commerceRepository.GetContactInquiryAsync(inquiryId)
            ?? throw new InvalidOperationException("Inquiry not found.");
        var secrets = await _platformSecretsService.GetSecretsAsync();
        if (string.IsNullOrWhiteSpace(secrets.SesFromAddress))
        {
            throw new InvalidOperationException("SES sender address is not configured.");
        }

        var current = _requestContextService.GetCurrent();
        var emailResponse = await _emailService.SendEmailAsync(new SendEmailRequest
        {
            Source = secrets.SesFromAddress,
            Destination = new Destination { ToAddresses = [inquiry.Email] },
            Message = new Message
            {
                Subject = new Content(request.Subject),
                Body = new Body
                {
                    Text = new Content(request.MessageBody),
                },
            },
        });

        var reply = new ContactReplyRecord
        {
            Id = Guid.NewGuid().ToString("N"),
            InquiryId = inquiry.Id,
            AdminUserId = current.UserId,
            SenderEmail = secrets.SesFromAddress,
            RecipientEmail = inquiry.Email,
            Subject = request.Subject,
            MessageBody = request.MessageBody,
            DeliveryStatus = "sent",
            SesMessageId = emailResponse.MessageId,
            SentAt = DateTime.UtcNow,
            Pk = $"CONTACT#{inquiry.Id}",
            Sk = $"REPLY#{DateTime.UtcNow:O}#{Guid.NewGuid():N}",
            EntityType = nameof(ContactReplyRecord),
        };

        await _commerceRepository.SaveContactReplyAsync(reply);
        inquiry.Status = InquiryStatuses.Replied;
        inquiry.Unread = false;
        inquiry.LastReplyPreview = request.MessageBody.Length > 120 ? request.MessageBody[..120] : request.MessageBody;
        inquiry.UpdatedAt = DateTime.UtcNow;
        await _commerceRepository.SaveContactInquiryAsync(inquiry);
        await _activityService.TrackAsync(ActivityEventTypes.ContactReplied, new() { ["inquiryId"] = inquiry.Id, ["recipient"] = inquiry.Email }, userId: current.UserId, userEmail: current.Email, role: current.Role);

        return MapReply(reply);
    }

    private static ContactInquiryDto MapInquiry(ContactInquiry inquiry)
    {
        return new ContactInquiryDto
        {
            Id = inquiry.Id,
            UserId = inquiry.UserId,
            Name = inquiry.Name,
            Email = inquiry.Email,
            Team = inquiry.Team,
            Role = inquiry.Role,
            Subject = inquiry.Subject,
            Message = inquiry.Message,
            Status = inquiry.Status,
            Unread = inquiry.Unread,
            CreatedAt = inquiry.CreatedAt.ToString("O"),
            UpdatedAt = inquiry.UpdatedAt.ToString("O"),
            LastReplyPreview = inquiry.LastReplyPreview,
        };
    }

    private static ContactReplyDto MapReply(ContactReplyRecord reply)
    {
        return new ContactReplyDto
        {
            Id = reply.Id,
            InquiryId = reply.InquiryId,
            AdminUserId = reply.AdminUserId,
            SenderEmail = reply.SenderEmail,
            RecipientEmail = reply.RecipientEmail,
            Subject = reply.Subject,
            MessageBody = reply.MessageBody,
            DeliveryStatus = reply.DeliveryStatus,
            SentAt = reply.SentAt.ToString("O"),
        };
    }
}
