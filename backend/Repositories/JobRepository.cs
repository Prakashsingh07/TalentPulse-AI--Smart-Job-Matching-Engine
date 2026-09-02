using Microsoft.EntityFrameworkCore;
using JobPortal.API.Data;
using JobPortal.API.Models;

namespace JobPortal.API.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly JobPortalDbContext _context;

        public JobRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<Job?> GetByIdAsync(Guid id)
        {
            return await _context.Jobs
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.Id == id);
        }

        public async Task<List<Job>> GetPublishedJobsAsync(string? keyword, string? location, string? jobType)
        {
            var query = _context.Jobs.Where(j => j.Status == JobStatus.Published).AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.ToLower();
                query = query.Where(j => j.Title.ToLower().Contains(kw) || j.Description.ToLower().Contains(kw));
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(j => j.Location.ToLower().Contains(location.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(jobType) && jobType != "All")
            {
                query = query.Where(j => j.JobType == jobType);
            }

            return await query.OrderByDescending(j => j.CreatedAt).ToListAsync();
        }

        public async Task<List<Job>> GetPendingJobsAsync()
        {
            return await _context.Jobs
                .Where(j => j.Status == JobStatus.PendingApproval)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Job>> GetAllJobsAsync()
        {
            return await _context.Jobs.ToListAsync();
        }

        public async Task AddJobAsync(Job job)
        {
            await _context.Jobs.AddAsync(job);
        }

        public async Task UpdateJobAsync(Job job)
        {
            _context.Jobs.Update(job);
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
