using Microsoft.AspNetCore.Mvc;
using JobPortal.API.DTOs;
using JobPortal.API.Services;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs([FromQuery] JobQueryDto query)
        {
            var result = await _jobService.GetPublishedJobsAsync(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(Guid id)
        {
            var result = await _jobService.GetJobByIdAsync(id);
            if (result == null) return NotFound("Job not found.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            var result = await _jobService.CreateJobAsync(dto);
            return CreatedAtAction(nameof(GetJobById), new { id = result.Id }, result);
        }
    }
}
