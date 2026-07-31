using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPortal.API.Data;
using JobPortal.API.Models;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly JobPortalDbContext _context;

        public AdminController(JobPortalDbContext context)
        {
            _context = context;
        }

        [HttpGet("pending-employers")]
        public async Task<IActionResult> GetPendingEmployers()
        {
            var pending = await _context.Users
                .Where(u => u.Role == UserRole.Employer && !u.IsApproved)
                .ToListAsync();

            return Ok(pending);
        }

        [HttpPost("approve-employer/{id}")]
        public async Task<IActionResult> ApproveEmployer(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Employer approved successfully" });
        }

        [HttpGet("pending-jobs")]
        public async Task<IActionResult> GetPendingJobs()
        {
            var pending = await _context.Jobs
                .Where(j => j.Status == JobStatus.PendingApproval)
                .ToListAsync();

            return Ok(pending);
        }

        [HttpPost("approve-job/{id}")]
        public async Task<IActionResult> ApproveJob(Guid id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            job.Status = JobStatus.Published;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Job published successfully" });
        }
    }
}
