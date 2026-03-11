using ListingPilot.Application.DTOs;
using ListingPilot.Domain.Entities;
using ListingPilot.Infrastructure.Repositories;

namespace ListingPilot.Application.Services;

public interface ISettingsService
{
    Task<WorkspaceSettingsDto> GetSettingsAsync();
    Task<WorkspaceSettingsDto> UpdateSettingsAsync(WorkspaceSettingsDto settings);
}

public class SettingsService : ISettingsService
{
    private readonly IPlatformRepository _platformRepository;

    public SettingsService(IPlatformRepository platformRepository)
    {
        _platformRepository = platformRepository;
    }

    public async Task<WorkspaceSettingsDto> GetSettingsAsync()
    {
        var settings = await _platformRepository.GetSettingsAsync();
        return Map(settings);
    }

    public async Task<WorkspaceSettingsDto> UpdateSettingsAsync(WorkspaceSettingsDto settings)
    {
        var entity = new WorkspaceSettings
        {
            Id = "settings-default",
            DefaultTone = settings.DefaultTone,
            TeamPreset = settings.TeamPreset,
            BrandVoice = settings.BrandVoice,
            AutoSaveEnabled = settings.AutoSaveEnabled,
            RequireReview = settings.RequireReview,
            ComplianceMode = settings.ComplianceMode,
            Pk = "TEAM#team-atlanta",
            Sk = "SETTINGS#workspace",
            EntityType = "WorkspaceSettings",
        };

        var saved = await _platformRepository.SaveSettingsAsync(entity);
        return Map(saved);
    }

    private static WorkspaceSettingsDto Map(WorkspaceSettings settings) => new()
    {
        DefaultTone = settings.DefaultTone,
        TeamPreset = settings.TeamPreset,
        BrandVoice = settings.BrandVoice,
        AutoSaveEnabled = settings.AutoSaveEnabled,
        RequireReview = settings.RequireReview,
        ComplianceMode = settings.ComplianceMode,
    };
}
