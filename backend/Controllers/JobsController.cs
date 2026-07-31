using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPortal.API.Data;
using JobPortal.API.Models;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly JobPortalDbContext _context;

        public JobsController(JobPortalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs([FromQuery] string? keyword, [FromQuery] string? location, [FromQuery] string? jobType)
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

            var result = await query.OrderByDescending(j => j.CreatedAt).ToListAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            job.Id = Guid.NewGuid();
            job.Status = JobStatus.PendingApproval; // Requires Admin Approval
            job.CreatedAt = DateTime.UtcNow;

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobs), new { id = job.Id }, job);
        }
    }
}
