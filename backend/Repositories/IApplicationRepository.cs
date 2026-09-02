using JobPortal.API.Models;

namespace JobPortal.API.Repositories
{
    public interface IApplicationRepository
    {
        Task<JobApplication?> GetByIdAsync(Guid id);
        Task<List<JobApplication>> GetByJobIdRankedAsync(Guid jobId);
        Task<List<JobApplication>> GetBySeekerIdAsync(Guid seekerId);
        Task<List<JobApplication>> GetAllApplicationsAsync();
        Task AddApplicationAsync(JobApplication application);
        Task SaveChangesAsync();
    }
}
