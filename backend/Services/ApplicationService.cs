using System.Text.Json;
using JobPortal.API.DTOs;
using JobPortal.API.Models;
using JobPortal.API.Repositories;

namespace JobPortal.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IUserRepository _userRepository;
        private readonly INlpMatchingEngine _matchingEngine;

        public ApplicationService(
            IApplicationRepository applicationRepository,
            IJobRepository jobRepository,
            IUserRepository userRepository,
            INlpMatchingEngine matchingEngine)
        {
            _applicationRepository = applicationRepository;
            _jobRepository = jobRepository;
            _userRepository = userRepository;
            _matchingEngine = matchingEngine;
        }

        public async Task<ApplicationResponseDto> ApplyToJobAsync(ApplyRequestDto request)
        {
            var job = await _jobRepository.GetByIdAsync(request.JobId);
            if (job == null) throw new KeyNotFoundException("Job not found.");

            var seeker = await _userRepository.GetByIdAsync(request.JobSeekerId);
            if (seeker == null || seeker.SeekerProfile == null)
            {
                throw new InvalidOperationException("Job seeker profile missing.");
            }

            var profile = seeker.SeekerProfile;
            var skills = request.SeekerSkills ?? TryDeserializeList(profile.SkillsJson);
            var resumeText = !string.IsNullOrWhiteSpace(request.ResumeText) ? request.ResumeText : (profile.ResumeTextContent ?? "");

            var diagnostic = _matchingEngine.ComputeMatch(resumeText, skills, job);

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

            await _applicationRepository.AddApplicationAsync(application);
            await _applicationRepository.SaveChangesAsync();

            return new ApplicationResponseDto
            {
                Id = application.Id,
                JobId = application.JobId,
                JobSeekerId = application.JobSeekerId,
                ApplicantName = seeker.FullName,
                ApplicantEmail = seeker.Email,
                AppliedAt = application.AppliedAt,
                Status = application.Status.ToString(),
                MatchScore = application.MatchScore,
                MatchedSkills = diagnostic.MatchedSkills,
                MissingSkills = diagnostic.MissingSkills,
                AiAnalysis = application.AiAnalysis
            };
        }

        public async Task<List<ApplicationResponseDto>> GetJobApplicantsRankedAsync(Guid jobId)
        {
            var apps = await _applicationRepository.GetByJobIdRankedAsync(jobId);
            return apps.Select(MapToDto).ToList();
        }

        public async Task<List<ApplicationResponseDto>> GetSeekerApplicationsAsync(Guid seekerId)
        {
            var apps = await _applicationRepository.GetBySeekerIdAsync(seekerId);
            return apps.Select(MapToDto).ToList();
        }

        private static ApplicationResponseDto MapToDto(JobApplication app)
        {
            return new ApplicationResponseDto
            {
                Id = app.Id,
                JobId = app.JobId,
                JobSeekerId = app.JobSeekerId,
                ApplicantName = app.JobSeeker?.FullName ?? "Candidate",
                ApplicantEmail = app.JobSeeker?.Email ?? "",
                AppliedAt = app.AppliedAt,
                Status = app.Status.ToString(),
                MatchScore = app.MatchScore,
                MatchedSkills = TryDeserializeList(app.MatchedSkillsJson),
                MissingSkills = TryDeserializeList(app.MissingSkillsJson),
                AiAnalysis = app.AiAnalysis
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
