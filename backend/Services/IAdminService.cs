using JobPortal.API.DTOs;

namespace JobPortal.API.Services
{
    public interface IAdminService
    {
        Task<List<PendingEmployerDto>> GetPendingEmployersAsync();
        Task ApproveEmployerAsync(Guid id);
        Task<List<JobResponseDto>> GetPendingJobsAsync();
        Task ApproveJobAsync(Guid id);
        Task<SystemMetricsDto> GetSystemMetricsAsync();
    }
}
