using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;
using System.Text.Json;

namespace ListingPilot.Application.Services;

public interface IAdminService
{
    Task<List<UserSummaryDto>> GetUsersAsync();
    Task<AdminAnalyticsDto> GetAnalyticsAsync();
    Task<List<LeadDto>> GetLeadsAsync();
    Task<List<SupportTicketDto>> GetSupportTicketsAsync();
    Task<List<SubscriptionPlanDto>> GetPlansAsync();
    Task<List<AuditEventDto>> GetAuditEventsAsync();
    Task<AdminDashboardDto> GetDashboardAsync();
    Task<UserDetailDto> GetUserDetailAsync(string userId);
    Task<CurrentUserDto> UpdateUserAsync(string userId, UpdateUserRequestDto request);
    Task<UserNoteDto> AddUserNoteAsync(string userId, CreateUserNoteRequestDto request);
    Task<List<ContactInquiryDto>> GetContactInquiriesAsync();
    Task<(ContactInquiryDto Inquiry, List<ContactReplyDto> Replies)> GetContactInquiryDetailAsync(string inquiryId);
}

public class AdminService : IAdminService
{
    private readonly IPlatformRepository _platformRepository;
    private readonly ICommerceRepository _commerceRepository;
    private readonly IRequestContextService _requestContextService;
    private readonly IActivityService _activityService;
    private readonly IContactService _contactService;

    public AdminService(
        IPlatformRepository platformRepository,
        ICommerceRepository commerceRepository,
        IRequestContextService requestContextService,
        IActivityService activityService,
        IContactService contactService)
    {
        _platformRepository = platformRepository;
        _commerceRepository = commerceRepository;
        _requestContextService = requestContextService;
        _activityService = activityService;
        _contactService = contactService;
    }

    public async Task<List<UserSummaryDto>> GetUsersAsync()
    {
        var users = await _commerceRepository.ListUsersAsync();
        return users.Select(MapUserSummary)
            .OrderByDescending(user => user.LastActiveAt)
            .ToList();
    }

    public async Task<AdminAnalyticsDto> GetAnalyticsAsync()
    {
        var users = await _commerceRepository.ListUsersAsync();
        var leads = await _platformRepository.GetLeadsAsync();
        var purchases = await _commerceRepository.ListPurchasesAsync();

        return new AdminAnalyticsDto
        {
            TotalUsers = users.Count,
            ActiveUsers = users.Count(user => user.AccountState.Equals(AccountStates.Active, StringComparison.OrdinalIgnoreCase)),
            TrialUsers = users.Count(user => user.PlanCode.Equals("free", StringComparison.OrdinalIgnoreCase)),
            PaidUsers = users.Count(user => !user.PlanCode.Equals("free", StringComparison.OrdinalIgnoreCase)),
            TotalGenerations = users.Sum(user => user.OutputGeneratedCount),
            TotalLeads = leads.Count,
            FunnelSummary = $"{users.Count(user => user.DemoActionsUsed > 0)} demo users → {users.Count(user => user.ConversionFunnelStage is "signed_up" or "paid")} signups → {users.Count(user => user.ConversionFunnelStage == "paid")} paid",
            MrrPlaceholder = $"${purchases.Where(x => x.Status == PurchaseStatuses.Completed).Sum(x => x.AmountUsd):0}",
        };
    }

    public async Task<List<LeadDto>> GetLeadsAsync()
    {
        var leads = await _platformRepository.GetLeadsAsync();
        return leads.Select(lead => new LeadDto
        {
            Id = lead.Id,
            Name = lead.Name,
            Stage = lead.Stage,
            Source = lead.Source,
            PropertyAddress = lead.PropertyAddress,
            IntentScore = lead.IntentScore,
            Owner = lead.Owner,
            LastActivity = lead.LastActivity,
            EstimatedValue = lead.EstimatedValue,
        }).ToList();
    }

    public Task<List<SupportTicketDto>> GetSupportTicketsAsync()
    {
        List<SupportTicketDto> tickets =
        [
            new() { Id = "support-1", Type = "Bug", Subject = "MLS review warning persists after save", Status = "Open", Priority = "High", Owner = "Support", CreatedAt = DateTime.UtcNow.AddHours(-4).ToString("MMM d, h:mm tt") },
            new() { Id = "support-2", Type = "Feature", Subject = "Need broker-level shared presets", Status = "Review", Priority = "Medium", Owner = "Product", CreatedAt = DateTime.UtcNow.AddDays(-1).ToString("MMM d, h:mm tt") },
            new() { Id = "support-3", Type = "Contact", Subject = "Book onboarding session for 12-agent team", Status = "Scheduled", Priority = "Medium", Owner = "Sales", CreatedAt = DateTime.UtcNow.AddDays(-2).ToString("MMM d, h:mm tt") },
        ];

        return Task.FromResult(tickets);
    }

    public async Task<List<SubscriptionPlanDto>> GetPlansAsync()
    {
        var plans = await _commerceRepository.GetPackagesAsync();
        return plans.Select(plan => new SubscriptionPlanDto
        {
            Id = plan.Id,
            Name = plan.Name,
            MonthlyPrice = plan.PriceUsd,
            MonthlyGenerationLimit = plan.Credits,
            TeamSeats = plan.IncludesTeamCapabilities ? 10 : 1,
            IsFeatured = plan.IsFeatured,
            CtaLabel = "Buy package",
        }).ToList();
    }

    public async Task<List<AuditEventDto>> GetAuditEventsAsync()
    {
        var actions = await _commerceRepository.ListAdminActionsAsync();
        return actions.Select(evt => new AuditEventDto
        {
            Id = evt.Id,
            Actor = evt.AdminEmail,
            Action = evt.ActionType,
            Target = evt.TargetUserId,
            CreatedAt = evt.CreatedAt.ToString("MMM d, h:mm tt"),
        }).ToList();
    }

    public async Task<AdminDashboardDto> GetDashboardAsync()
    {
        var users = await _commerceRepository.ListUsersAsync();
        var purchases = await _commerceRepository.ListPurchasesAsync();
        var inquiries = await _commerceRepository.ListContactInquiriesAsync();
        var events = await _commerceRepository.ListEventsAsync();

        var totalUsers = users.Count;
        var paidUsers = users.Count(x => !x.PlanCode.Equals("free", StringComparison.OrdinalIgnoreCase));
        var signupUsers = users.Count(x => x.ConversionFunnelStage is "signed_up" or "paid");
        var demoUsers = users.Count(x => x.DemoActionsUsed > 0);
        var activeUsers = users.Count(x => x.LastActivityAt >= DateTime.UtcNow.AddDays(-30));

        return new AdminDashboardDto
        {
            TotalUsers = totalUsers,
            FreeUsers = users.Count(x => x.PlanCode.Equals("free", StringComparison.OrdinalIgnoreCase)),
            PaidUsers = paidUsers,
            ConversionRate = totalUsers == 0 ? 0 : decimal.Round((decimal)paidUsers / totalUsers * 100, 2),
            DemoToSignupRate = demoUsers == 0 ? 0 : decimal.Round((decimal)signupUsers / demoUsers * 100, 2),
            SignupToPaidRate = signupUsers == 0 ? 0 : decimal.Round((decimal)paidUsers / signupUsers * 100, 2),
            ActiveUsers = activeUsers,
            RevenuePlaceholder = $"${purchases.Where(x => x.Status == PurchaseStatuses.Completed).Sum(x => x.AmountUsd):0.00}",
            ContactInquiriesOpen = inquiries.Count(x => x.Status is InquiryStatuses.New or InquiryStatuses.Open),
            TotalPurchases = purchases.Count,
            DemoLimitReachedCount = events.Count(x => x.EventType == ActivityEventTypes.DemoLimitReached),
        };
    }

    public async Task<UserDetailDto> GetUserDetailAsync(string userId)
    {
        var user = await _commerceRepository.GetUserByIdAsync(userId)
            ?? throw new InvalidOperationException("User not found.");
        var events = await _commerceRepository.GetUserEventsAsync(userId);
        var purchases = await _commerceRepository.GetPurchasesByUserIdAsync(userId);
        var notes = await _commerceRepository.GetUserNotesAsync(userId);
        var actions = await _commerceRepository.GetAdminActionsForUserAsync(userId);
        var inquiries = (await _commerceRepository.ListContactInquiriesAsync()).Where(x => x.UserId == userId || x.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)).ToList();

        return new UserDetailDto
        {
            User = MapCurrentUser(user),
            ActivityTimeline = events.Select(MapEvent).ToList(),
            Purchases = purchases.Select(MapPurchase).ToList(),
            Notes = notes.Select(MapNote).ToList(),
            AdminActions = actions.Select(MapAdminAction).ToList(),
            ContactHistory = inquiries.Select(MapInquiry).ToList(),
        };
    }

    public async Task<CurrentUserDto> UpdateUserAsync(string userId, UpdateUserRequestDto request)
    {
        var current = _requestContextService.GetCurrent();
        var user = await _commerceRepository.GetUserByIdAsync(userId)
            ?? throw new InvalidOperationException("User not found.");

        var oldState = JsonSerializer.Serialize(new
        {
            user.PlanCode,
            user.Role,
            user.AccountState,
            user.CreditBalance,
            user.IncentiveCreditBalance,
        });

        user.PlanCode = string.IsNullOrWhiteSpace(request.PlanCode) ? user.PlanCode : request.PlanCode;
        user.Role = string.IsNullOrWhiteSpace(request.Role) ? user.Role : request.Role;
        user.IsAdmin = user.Role.Equals(PlatformRoles.Admin, StringComparison.OrdinalIgnoreCase);
        user.AccountState = string.IsNullOrWhiteSpace(request.AccountState) ? user.AccountState : request.AccountState;
        user.CreditBalance = Math.Max(0, user.CreditBalance + request.CreditDelta);
        user.IncentiveCreditBalance = Math.Max(0, user.IncentiveCreditBalance + request.IncentiveCreditDelta);
        user.UpdatedAt = DateTime.UtcNow;
        await _commerceRepository.UpsertUserAsync(user);

        var action = new AdminActionRecord
        {
            Id = Guid.NewGuid().ToString("N"),
            AdminUserId = current.UserId,
            AdminEmail = current.Email,
            ActionType = "user_updated",
            TargetUserId = user.Id,
            TargetType = nameof(UserProfile),
            OldValueJson = oldState,
            NewValueJson = JsonSerializer.Serialize(new
            {
                user.PlanCode,
                user.Role,
                user.AccountState,
                user.CreditBalance,
                user.IncentiveCreditBalance,
            }),
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            Pk = "ADMIN_ACTION",
            Sk = $"ACTION#{DateTime.UtcNow:O}#{Guid.NewGuid():N}",
            EntityType = nameof(AdminActionRecord),
        };
        await _commerceRepository.SaveAdminActionAsync(action);
        await _activityService.TrackAsync(ActivityEventTypes.AdminAction, new() { ["action"] = action.ActionType, ["targetUserId"] = user.Id }, userId: current.UserId, userEmail: current.Email, role: current.Role);

        return MapCurrentUser(user);
    }

    public async Task<UserNoteDto> AddUserNoteAsync(string userId, CreateUserNoteRequestDto request)
    {
        var current = _requestContextService.GetCurrent();
        var note = new UserNoteRecord
        {
            Id = Guid.NewGuid().ToString("N"),
            UserId = userId,
            AdminUserId = current.UserId,
            AdminEmail = current.Email,
            Body = request.Body,
            CreatedAt = DateTime.UtcNow,
            Pk = $"USER#{userId}",
            Sk = $"NOTE#{DateTime.UtcNow:O}#{Guid.NewGuid():N}",
            EntityType = nameof(UserNoteRecord),
        };

        await _commerceRepository.SaveUserNoteAsync(note);
        return MapNote(note);
    }

    public Task<List<ContactInquiryDto>> GetContactInquiriesAsync() => _contactService.GetInquiriesAsync();

    public Task<(ContactInquiryDto Inquiry, List<ContactReplyDto> Replies)> GetContactInquiryDetailAsync(string inquiryId)
        => _contactService.GetInquiryDetailAsync(inquiryId);

    private static UserSummaryDto MapUserSummary(UserProfile user)
    {
        return new UserSummaryDto
        {
            Id = user.Id,
            Name = user.FullName,
            Email = user.Email,
            Plan = user.PlanCode,
            Status = user.AccountState,
            TeamName = user.TeamName,
            LastActiveAt = user.LastActivityAt?.ToString("O") ?? string.Empty,
            GenerationCount = user.OutputGeneratedCount,
            MonthlyUsage = user.DemoActionsUsed,
        };
    }

    private static CurrentUserDto MapCurrentUser(UserProfile user)
    {
        return new CurrentUserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            AccountState = user.AccountState,
            EmailVerified = user.EmailVerified,
            PlanCode = user.PlanCode,
            CreditBalance = user.CreditBalance,
            IncentiveCreditBalance = user.IncentiveCreditBalance,
            DemoActionsUsed = user.DemoActionsUsed,
            OutputGeneratedCount = user.OutputGeneratedCount,
            ConversionFunnelStage = user.ConversionFunnelStage,
        };
    }

    private static ActivityEventRecordDto MapEvent(ActivityEventRecord evt)
    {
        return new ActivityEventRecordDto
        {
            Id = evt.Id,
            EventType = evt.EventType,
            UserEmail = evt.UserEmail,
            AnonymousId = evt.AnonymousId,
            Path = evt.Path,
            Source = evt.Source,
            OccurredAt = evt.OccurredAt.ToString("O"),
            Metadata = evt.Metadata,
        };
    }

    private static PurchaseRecordDto MapPurchase(PurchaseRecord purchase)
    {
        return new PurchaseRecordDto
        {
            Id = purchase.Id,
            PackageCode = purchase.PackageCode,
            Status = purchase.Status,
            AmountUsd = purchase.AmountUsd,
            CreditsGranted = purchase.CreditsGranted,
            ReceiptUrl = purchase.ReceiptUrl,
            CreatedAt = purchase.CreatedAt.ToString("O"),
            CompletedAt = purchase.CompletedAt?.ToString("O") ?? string.Empty,
        };
    }

    private static UserNoteDto MapNote(UserNoteRecord note)
    {
        return new UserNoteDto
        {
            Id = note.Id,
            Body = note.Body,
            AdminEmail = note.AdminEmail,
            CreatedAt = note.CreatedAt.ToString("O"),
        };
    }

    private static AdminActionRecordDto MapAdminAction(AdminActionRecord action)
    {
        return new AdminActionRecordDto
        {
            Id = action.Id,
            AdminEmail = action.AdminEmail,
            ActionType = action.ActionType,
            TargetUserId = action.TargetUserId,
            TargetType = action.TargetType,
            OldValueJson = action.OldValueJson,
            NewValueJson = action.NewValueJson,
            Notes = action.Notes,
            CreatedAt = action.CreatedAt.ToString("O"),
        };
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
}
