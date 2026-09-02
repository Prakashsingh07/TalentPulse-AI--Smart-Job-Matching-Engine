using Microsoft.AspNetCore.Mvc;
using JobPortal.API.DTOs;
using JobPortal.API.Services;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyToJob([FromBody] ApplyRequestDto request)
        {
            var result = await _applicationService.ApplyToJobAsync(request);
            return Ok(result);
        }

        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetJobApplicantsRanked(Guid jobId)
        {
            var result = await _applicationService.GetJobApplicantsRankedAsync(jobId);
            return Ok(result);
        }

        [HttpGet("seeker/{seekerId}")]
        public async Task<IActionResult> GetSeekerApplications(Guid seekerId)
        {
            var result = await _applicationService.GetSeekerApplicationsAsync(seekerId);
            return Ok(result);
        }
    }
}
