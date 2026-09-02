using System.Text.Json;
using JobPortal.API.DTOs;
using JobPortal.API.Models;
using JobPortal.API.Repositories;

namespace JobPortal.API.Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _jobRepository;

        public JobService(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        public async Task<List<JobResponseDto>> GetPublishedJobsAsync(JobQueryDto query)
        {
            var jobs = await _jobRepository.GetPublishedJobsAsync(query.Keyword, query.Location, query.JobType);
            return jobs.Select(MapToDto).ToList();
        }

        public async Task<JobResponseDto?> GetJobByIdAsync(Guid id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            return job == null ? null : MapToDto(job);
        }

        public async Task<JobResponseDto> CreateJobAsync(CreateJobDto dto)
        {
            var job = new Job
            {
                Id = Guid.NewGuid(),
                EmployerId = dto.EmployerId,
                CompanyName = dto.CompanyName,
                Title = dto.Title,
                Department = dto.Department,
                Description = dto.Description,
                RequirementsJson = JsonSerializer.Serialize(dto.Requirements),
                SkillsRequiredJson = JsonSerializer.Serialize(dto.SkillsRequired),
                Location = dto.Location,
                JobType = dto.JobType,
                SalaryRange = dto.SalaryRange,
                Status = JobStatus.PendingApproval, // Requires Admin Approval
                CreatedAt = DateTime.UtcNow
            };

            await _jobRepository.AddJobAsync(job);
            await _jobRepository.SaveChangesAsync();

            return MapToDto(job);
        }

        private static JobResponseDto MapToDto(Job job)
        {
            return new JobResponseDto
            {
                Id = job.Id,
                EmployerId = job.EmployerId,
                CompanyName = job.CompanyName,
                Title = job.Title,
                Department = job.Department,
                Description = job.Description,
                Requirements = TryDeserializeList(job.RequirementsJson),
                SkillsRequired = TryDeserializeList(job.SkillsRequiredJson),
                Location = job.Location,
                JobType = job.JobType,
                SalaryRange = job.SalaryRange,
                Status = job.Status,
                CreatedAt = job.CreatedAt,
                ApplicationsCount = job.Applications?.Count ?? 0
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
