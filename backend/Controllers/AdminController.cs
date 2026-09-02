using Microsoft.AspNetCore.Mvc;
using JobPortal.API.Services;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("pending-employers")]
        public async Task<IActionResult> GetPendingEmployers()
        {
            var result = await _adminService.GetPendingEmployersAsync();
            return Ok(result);
        }

        [HttpPost("approve-employer/{id}")]
        public async Task<IActionResult> ApproveEmployer(Guid id)
        {
            await _adminService.ApproveEmployerAsync(id);
            return Ok(new { Message = "Employer approved successfully" });
        }

        [HttpGet("pending-jobs")]
        public async Task<IActionResult> GetPendingJobs()
        {
            var result = await _adminService.GetPendingJobsAsync();
            return Ok(result);
        }

        [HttpPost("approve-job/{id}")]
        public async Task<IActionResult> ApproveJob(Guid id)
        {
            await _adminService.ApproveJobAsync(id);
            return Ok(new { Message = "Job published successfully" });
        }

        [HttpGet("metrics")]
        public async Task<IActionResult> GetMetrics()
        {
            var result = await _adminService.GetSystemMetricsAsync();
            return Ok(result);
        }
    }
}
