using JobPortal.API.DTOs;

namespace JobPortal.API.Services
{
    public interface IApplicationService
    {
        Task<ApplicationResponseDto> ApplyToJobAsync(ApplyRequestDto request);
        Task<List<ApplicationResponseDto>> GetJobApplicantsRankedAsync(Guid jobId);
        Task<List<ApplicationResponseDto>> GetSeekerApplicationsAsync(Guid seekerId);
    }
}
