using JobPortal.API.Models;

namespace JobPortal.API.Repositories
{
    public interface IJobRepository
    {
        Task<Job?> GetByIdAsync(Guid id);
        Task<List<Job>> GetPublishedJobsAsync(string? keyword, string? location, string? jobType);
        Task<List<Job>> GetPendingJobsAsync();
        Task<List<Job>> GetAllJobsAsync();
        Task AddJobAsync(Job job);
        Task UpdateJobAsync(Job job);
        Task SaveChangesAsync();
    }
}
