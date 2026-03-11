using ListingPilot.Application.DTOs;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface IAdminService
{
    Task<List<UserSummaryDto>> GetUsersAsync();
    Task<AdminAnalyticsDto> GetAnalyticsAsync();
    Task<List<LeadDto>> GetLeadsAsync();
    Task<List<SupportTicketDto>> GetSupportTicketsAsync();
    Task<List<SubscriptionPlanDto>> GetPlansAsync();
    Task<List<AuditEventDto>> GetAuditEventsAsync();
}

public class AdminService : IAdminService
{
    private readonly IPlatformRepository _platformRepository;

    public AdminService(IPlatformRepository platformRepository)
    {
        _platformRepository = platformRepository;
    }

    public async Task<List<UserSummaryDto>> GetUsersAsync()
    {
        var users = await _platformRepository.GetUsersAsync();
        return users.Select(user => new UserSummaryDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Plan = user.Plan,
            Status = user.Status,
            TeamName = user.TeamName,
            LastActiveAt = user.LastActiveAt.ToString("MMM d, h:mm tt"),
            GenerationCount = user.GenerationCount,
            MonthlyUsage = user.MonthlyUsage,
        }).ToList();
    }

    public async Task<AdminAnalyticsDto> GetAnalyticsAsync()
    {
        var users = await _platformRepository.GetUsersAsync();
        var leads = await _platformRepository.GetLeadsAsync();

        return new AdminAnalyticsDto
        {
            TotalUsers = users.Count,
            ActiveUsers = users.Count(user => user.Status.Equals("Active", StringComparison.OrdinalIgnoreCase)),
            TrialUsers = users.Count(user => user.Status.Contains("Trial", StringComparison.OrdinalIgnoreCase)),
            PaidUsers = users.Count(user => !user.Status.Contains("Trial", StringComparison.OrdinalIgnoreCase)),
            TotalGenerations = users.Sum(user => user.GenerationCount),
            TotalLeads = leads.Count,
            FunnelSummary = "38 demos → 19 trials → 11 active paid teams",
            MrrPlaceholder = "$18.4k MRR",
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
        var plans = await _platformRepository.GetPlansAsync();
        return plans.Select(plan => new SubscriptionPlanDto
        {
            Id = plan.Id,
            Name = plan.Name,
            MonthlyPrice = plan.MonthlyPrice,
            MonthlyGenerationLimit = plan.MonthlyGenerationLimit,
            TeamSeats = plan.TeamSeats,
            IsFeatured = plan.IsFeatured,
            CtaLabel = plan.CtaLabel,
        }).ToList();
    }

    public async Task<List<AuditEventDto>> GetAuditEventsAsync()
    {
        var events = await _platformRepository.GetAuditEventsAsync();
        return events.Select(evt => new AuditEventDto
        {
            Id = evt.Id,
            Actor = evt.Actor,
            Action = evt.Action,
            Target = evt.Target,
            CreatedAt = evt.CreatedAt.ToString("MMM d, h:mm tt"),
        }).ToList();
    }
}
