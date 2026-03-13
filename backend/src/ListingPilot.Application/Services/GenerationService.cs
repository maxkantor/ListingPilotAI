using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface IGenerationService
{
    Task<GenerateResponseEnvelopeDto> GenerateAsync(GenerateRequestDto request);
    Task<List<HistoryItemDto>> GetHistoryAsync();
    Task<PropertyInputDto> GetSamplePropertyAsync();
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    Task<List<PerformanceSnapshotDto>> GetPerformanceSnapshotsAsync();
    Task<List<LeadDto>> GetLeadsAsync();
    Task<AdminOverviewDto> GetAdminOverviewAsync();
    Task<AnalyticsOverviewDto> GetAnalyticsOverviewAsync();
}

public class GenerationService : IGenerationService
{
    private readonly IAiService _aiService;
    private readonly IGenerationRepository _repository;
    private readonly IUsagePolicyService _usagePolicyService;
    private readonly IRequestContextService _requestContextService;

    public GenerationService(IAiService aiService, IGenerationRepository repository, IUsagePolicyService usagePolicyService, IRequestContextService requestContextService)
    {
        _aiService = aiService;
        _repository = repository;
        _usagePolicyService = usagePolicyService;
        _requestContextService = requestContextService;
    }

    public async Task<GenerateResponseEnvelopeDto> GenerateAsync(GenerateRequestDto request)
    {
        var scope = request.UsageContext?.Scope ?? (_requestContextService.GetCurrent().IsAuthenticated ? "workspace" : "demo");
        var anonymousId = request.UsageContext?.AnonymousId ?? _requestContextService.GetCurrent().AnonymousId;
        var usage = await _usagePolicyService.ConsumeGenerationAsync(scope, anonymousId);
        var output = await _aiService.GenerateAsync(request.Property);

        var record = new GenerationRecord
        {
            Property = MapToEntity(request.Property),
            Output = MapToEntity(output),
        };

        var saved = await _repository.SaveAsync(record);

        return new GenerateResponseEnvelopeDto
        {
            Result = new GenerateResponseDto
            {
                Id = saved.Id,
                Output = MapToDto(saved.Output),
                CreatedAt = saved.CreatedAt,
            },
            Usage = usage,
        };
    }

    public async Task<List<HistoryItemDto>> GetHistoryAsync()
    {
        var records = await _repository.GetAllAsync();
        return records
            .Select(r => new HistoryItemDto
            {
                Id = r.Id,
                StreetAddress = r.Property.StreetAddress,
                City = r.Property.City,
                State = r.Property.State,
                Price = r.Property.Price,
                CreatedAt = r.CreatedAt,
                Output = MapToDto(r.Output),
            })
            .ToList();
    }

    public Task<PropertyInputDto> GetSamplePropertyAsync()
    {
        var sample = new PropertyInputDto
        {
            ListingUrl = "",
            StreetAddress = "4812 Wieuca Road NE",
            City = "Atlanta",
            State = "GA",
            Zip = "30342",
            Price = "1,275,000",
            Beds = "5",
            Baths = "4.5",
            SquareFeet = "4,200",
            LotSize = "0.42 acres",
            PropertyType = "Single Family",
            YearBuilt = "2019",
            Neighborhood = "Buckhead",
            KeyFeatures =
                "Chef's kitchen with quartz countertops, open concept living area, primary suite with spa bath, finished terrace level, 3-car garage, smart home technology throughout",
            InteriorFeatures =
                "Hardwood floors throughout main level, 10-ft ceilings, coffered ceilings in dining room, custom built-ins in study, gas fireplace, wine cellar",
            ExteriorFeatures =
                "Heated saltwater pool with spa, covered outdoor kitchen, level fenced backyard, professional landscaping, full irrigation system",
            SchoolInfo =
                "Sarah Smith Elementary, Sutton Middle School, North Atlanta High School (all highly rated Atlanta Public Schools)",
            AgentNotes =
                "Sellers are motivated and flexible on closing date. Home has been meticulously maintained and shows like new. One-year home warranty included.",
            TargetBuyerType = "Luxury move-up buyer, executive family, corporate relocation",
            Tone = "Luxury",
        };

        return Task.FromResult(sample);
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var records = await _repository.GetAllAsync();
        var generated = records.Count;

        return new DashboardSummaryDto
        {
            ActiveListings = Math.Max(12, generated + 9),
            OutputsGenerated = Math.Max(36, generated * 6),
            AvgTurnaround = "42 sec",
            PipelineValue = "$3.8M",
            ConversionLift = "+18%",
            PriorityActions =
            [
                "Follow up with luxury leads from the Buckhead launch sequence.",
                "Refresh underperforming MLS copy for listings older than 14 days.",
                "Prompt agents to publish Instagram reels for new waterfront inventory.",
            ],
            TopChannels =
            [
                new ChannelPerformanceDto
                {
                    Channel = "instagram",
                    Label = "Instagram Reels",
                    ConversionRate = "6.4%",
                    EngagementLift = "+31%",
                    Status = "Scaling",
                },
                new ChannelPerformanceDto
                {
                    Channel = "email",
                    Label = "Email Nurture",
                    ConversionRate = "4.9%",
                    EngagementLift = "+18%",
                    Status = "Healthy",
                },
                new ChannelPerformanceDto
                {
                    Channel = "mls",
                    Label = "MLS Syndication",
                    ConversionRate = "3.8%",
                    EngagementLift = "+12%",
                    Status = "Needs refresh",
                },
            ],
        };
    }

    public Task<List<PerformanceSnapshotDto>> GetPerformanceSnapshotsAsync()
    {
        List<PerformanceSnapshotDto> snapshots =
        [
            new() { Week = "Wk 1", Outputs = 24, QualifiedLeads = 6, ToursBooked = 2 },
            new() { Week = "Wk 2", Outputs = 31, QualifiedLeads = 9, ToursBooked = 3 },
            new() { Week = "Wk 3", Outputs = 36, QualifiedLeads = 11, ToursBooked = 4 },
            new() { Week = "Wk 4", Outputs = 42, QualifiedLeads = 14, ToursBooked = 5 },
            new() { Week = "Wk 5", Outputs = 47, QualifiedLeads = 17, ToursBooked = 6 },
            new() { Week = "Wk 6", Outputs = 53, QualifiedLeads = 19, ToursBooked = 7 },
        ];

        return Task.FromResult(snapshots);
    }

    public Task<List<LeadDto>> GetLeadsAsync()
    {
        List<LeadDto> leads =
        [
            new()
            {
                Id = "lead-101",
                Name = "Avery Chen",
                Stage = "Hot",
                Source = "Instagram Reel",
                PropertyAddress = "1180 West Paces Ferry Rd NW",
                IntentScore = "94 / 100",
                Owner = "Maya Reynolds",
                LastActivity = "Booked private tour · 2h ago",
                EstimatedValue = 2450000,
            },
            new()
            {
                Id = "lead-102",
                Name = "Daniel Brooks",
                Stage = "Nurture",
                Source = "Luxury Email",
                PropertyAddress = "4812 Wieuca Road NE",
                IntentScore = "76 / 100",
                Owner = "Maya Reynolds",
                LastActivity = "Opened campaign 3 times · today",
                EstimatedValue = 1275000,
            },
            new()
            {
                Id = "lead-103",
                Name = "Sophia Patel",
                Stage = "Offer",
                Source = "Referral",
                PropertyAddress = "905 Peachtree Battle Ave NW",
                IntentScore = "98 / 100",
                Owner = "Chris Walker",
                LastActivity = "Requested comps · 34m ago",
                EstimatedValue = 3190000,
            },
            new()
            {
                Id = "lead-104",
                Name = "Marcus Hill",
                Stage = "New",
                Source = "Website Demo",
                PropertyAddress = "220 Lake Forrest Lane",
                IntentScore = "68 / 100",
                Owner = "Sofia Bennett",
                LastActivity = "Submitted form · 1d ago",
                EstimatedValue = 980000,
            },
        ];

        return Task.FromResult(leads);
    }

    public Task<AdminOverviewDto> GetAdminOverviewAsync()
    {
        var overview = new AdminOverviewDto
        {
            ActiveAgents = 124,
            TrialAccounts = 38,
            MonthlyRecurringRevenue = "$18.4k",
            ChurnRisk = "5 accounts flagged",
            OpenSupportTickets = 7,
            Pipeline =
            [
                new() { Stage = "New", Count = 28, Value = "$7.1M" },
                new() { Stage = "Qualified", Count = 19, Value = "$5.4M" },
                new() { Stage = "Showing", Count = 11, Value = "$3.2M" },
                new() { Stage = "Offer", Count = 4, Value = "$1.9M" },
            ],
            Alerts =
            [
                "3 enterprise demos need owner assignment before tomorrow morning.",
                "2 trial accounts generated over 80 assets without inviting a teammate.",
                "1 support ticket mentions MLS compliance review delays.",
            ],
        };

        return Task.FromResult(overview);
    }

    public Task<AnalyticsOverviewDto> GetAnalyticsOverviewAsync()
    {
        var overview = new AnalyticsOverviewDto
        {
            OrganicTrafficGrowth = "+42%",
            DemoConversionRate = "8.6%",
            TrialActivationRate = "61%",
            TopLandingPage = "/demo",
            SeoPriorities =
            [
                "Publish city-specific landing pages with agent-focused schema markup.",
                "Expand comparison content for ChatGPT vs ListingPilot search demand.",
                "Improve internal links from pricing and demo pages to activation CTA.",
            ],
        };

        return Task.FromResult(overview);
    }

    private static Property MapToEntity(PropertyInputDto dto)
    {
        return new Property
        {
            ListingUrl = dto.ListingUrl,
            StreetAddress = dto.StreetAddress,
            City = dto.City,
            State = dto.State,
            Zip = dto.Zip,
            Price = dto.Price,
            Beds = dto.Beds,
            Baths = dto.Baths,
            SquareFeet = dto.SquareFeet,
            LotSize = dto.LotSize,
            PropertyType = dto.PropertyType,
            YearBuilt = dto.YearBuilt,
            Neighborhood = dto.Neighborhood,
            KeyFeatures = dto.KeyFeatures,
            InteriorFeatures = dto.InteriorFeatures,
            ExteriorFeatures = dto.ExteriorFeatures,
            SchoolInfo = dto.SchoolInfo,
            AgentNotes = dto.AgentNotes,
            TargetBuyerType = dto.TargetBuyerType,
            Tone = dto.Tone,
        };
    }

    private static GeneratedOutput MapToEntity(GeneratedOutputDto dto)
    {
        return new GeneratedOutput
        {
            MlsDescription = dto.MlsDescription,
            LuxuryDescription = dto.LuxuryDescription,
            FacebookPost = dto.FacebookPost,
            InstagramCaption = dto.InstagramCaption,
            LinkedInPost = dto.LinkedInPost,
            EmailBlurb = dto.EmailBlurb,
        };
    }

    private static GeneratedOutputDto MapToDto(GeneratedOutput entity)
    {
        return new GeneratedOutputDto
        {
            MlsDescription = entity.MlsDescription,
            LuxuryDescription = entity.LuxuryDescription,
            FacebookPost = entity.FacebookPost,
            InstagramCaption = entity.InstagramCaption,
            LinkedInPost = entity.LinkedInPost,
            EmailBlurb = entity.EmailBlurb,
        };
    }
}
