using Microsoft.EntityFrameworkCore;
using JobPortal.API.Data;
using JobPortal.API.Models;

namespace JobPortal.API.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly JobPortalDbContext _context;

        public ApplicationRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<JobApplication?> GetByIdAsync(Guid id)
        {
            return await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.JobSeeker)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<JobApplication>> GetByJobIdRankedAsync(Guid jobId)
        {
            return await _context.Applications
                .Include(a => a.JobSeeker)
                .ThenInclude(u => u.SeekerProfile)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.MatchScore) // AI Match ranking
                .ToListAsync();
        }

        public async Task<List<JobApplication>> GetBySeekerIdAsync(Guid seekerId)
        {
            return await _context.Applications
                .Include(a => a.Job)
                .Where(a => a.JobSeekerId == seekerId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();
        }

        public async Task<List<JobApplication>> GetAllApplicationsAsync()
        {
            return await _context.Applications.ToListAsync();
        }

        public async Task AddApplicationAsync(JobApplication application)
        {
            await _context.Applications.AddAsync(application);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
