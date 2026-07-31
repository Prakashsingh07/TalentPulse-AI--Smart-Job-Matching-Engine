using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPortal.API.Data;
using JobPortal.API.Models;
using JobPortal.API.Services;
using System.Text.Json;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly JobPortalDbContext _context;
        private readonly INlpMatchingEngine _matchingEngine;

        public ApplicationsController(JobPortalDbContext context, INlpMatchingEngine matchingEngine)
        {
            _context = context;
            _matchingEngine = matchingEngine;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyToJob([FromBody] ApplyRequest request)
        {
            var job = await _context.Jobs.FindAsync(request.JobId);
            if (job == null) return NotFound("Job not found");

            var seeker = await _context.Users
                .Include(u => u.SeekerProfile)
                .FirstOrDefaultAsync(u => u.Id == request.JobSeekerId);

            if (seeker == null || seeker.SeekerProfile == null)
                return BadRequest("Job seeker profile missing");

            var profile = seeker.SeekerProfile;
            var skills = JsonSerializer.Deserialize<List<string>>(profile.SkillsJson) ?? new();

            var diagnostic = _matchingEngine.ComputeMatch(profile.ResumeTextContent ?? "", skills, job);

            var application = new JobApplication
            {
                Id = Guid.NewGuid(),
                JobId = job.Id,
                JobSeekerId = seeker.Id,
                AppliedAt = DateTime.UtcNow,
                Status = ApplicationStatus.Submitted,
                MatchScore = diagnostic.MatchScore,
                MatchedSkillsJson = JsonSerializer.Serialize(diagnostic.MatchedSkills),
                MissingSkillsJson = JsonSerializer.Serialize(diagnostic.MissingSkills),
                AiAnalysis = $"{diagnostic.Summary} {diagnostic.Recommendation}"
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new { Application = application, Diagnostic = diagnostic });
        }

        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetJobApplicantsRanked(Guid jobId)
        {
            var applicants = await _context.Applications
                .Include(a => a.JobSeeker)
                .ThenInclude(u => u.SeekerProfile)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.MatchScore) // AI Score ranking
                .ToListAsync();

            return Ok(applicants);
        }
    }

    public class ApplyRequest
    {
        public Guid JobId { get; set; }
        public Guid JobSeekerId { get; set; }
    }
}
