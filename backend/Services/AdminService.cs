using System.Text.Json;
using JobPortal.API.DTOs;
using JobPortal.API.Models;
using JobPortal.API.Repositories;

namespace JobPortal.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IApplicationRepository _applicationRepository;

        public AdminService(
            IUserRepository userRepository,
            IJobRepository jobRepository,
            IApplicationRepository applicationRepository)
        {
            _userRepository = userRepository;
            _jobRepository = jobRepository;
            _applicationRepository = applicationRepository;
        }

        public async Task<List<PendingEmployerDto>> GetPendingEmployersAsync()
        {
            var users = await _userRepository.GetPendingEmployersAsync();
            return users.Select(u => new PendingEmployerDto
            {
                Id = u.Id,
                Email = u.Email,
                FullName = u.FullName,
                CompanyName = u.CompanyName,
                CreatedAt = u.CreatedAt
            }).ToList();
        }

        public async Task ApproveEmployerAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) throw new KeyNotFoundException("Employer user not found.");

            user.IsApproved = true;
            await _userRepository.UpdateUserAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        public async Task<List<JobResponseDto>> GetPendingJobsAsync()
        {
            var jobs = await _jobRepository.GetPendingJobsAsync();
            return jobs.Select(j => new JobResponseDto
            {
                Id = j.Id,
                EmployerId = j.EmployerId,
                CompanyName = j.CompanyName,
                Title = j.Title,
                Department = j.Department,
                Description = j.Description,
                Requirements = TryDeserializeList(j.RequirementsJson),
                SkillsRequired = TryDeserializeList(j.SkillsRequiredJson),
                Location = j.Location,
                JobType = j.JobType,
                SalaryRange = j.SalaryRange,
                Status = j.Status,
                CreatedAt = j.CreatedAt,
                ApplicationsCount = j.Applications?.Count ?? 0
            }).ToList();
        }

        public async Task ApproveJobAsync(Guid id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null) throw new KeyNotFoundException("Job not found.");

            job.Status = JobStatus.Published;
            await _jobRepository.UpdateJobAsync(job);
            await _jobRepository.SaveChangesAsync();
        }

        public async Task<SystemMetricsDto> GetSystemMetricsAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var jobs = await _jobRepository.GetAllJobsAsync();
            var apps = await _applicationRepository.GetAllApplicationsAsync();

            var totalUsers = users.Count;
            var seekers = users.Count(u => u.Role == UserRole.JobSeeker);
            var employers = users.Count(u => u.Role == UserRole.Employer);
            var pendingEmp = users.Count(u => u.Role == UserRole.Employer && !u.IsApproved);
            var pendingJobs = jobs.Count(j => j.Status == JobStatus.PendingApproval);
            var activeJobs = jobs.Count(j => j.Status == JobStatus.Published);
            var avgMatchRate = apps.Count > 0 ? apps.Average(a => a.MatchScore) : 85.0;

            return new SystemMetricsDto
            {
                TotalUsers = totalUsers,
                ActiveSeekers = seekers,
                TotalEmployers = employers,
                PendingApprovals = pendingEmp + pendingJobs,
                TotalJobs = jobs.Count,
                ActiveJobs = activeJobs,
                AverageMatchRate = Math.Round(avgMatchRate, 1)
            };
        }

        private static List<string> TryDeserializeList(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new List<string>();
            try
            {
                return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
            }
            catch
            {
                return new List<string>();
            }
        }
    }
}
