using JobPortal.API.DTOs;

namespace JobPortal.API.Services
{
    public interface IJobService
    {
        Task<List<JobResponseDto>> GetPublishedJobsAsync(JobQueryDto query);
        Task<JobResponseDto?> GetJobByIdAsync(Guid id);
        Task<JobResponseDto> CreateJobAsync(CreateJobDto dto);
    }
}
