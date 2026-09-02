using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class ApplyRequestDto
    {
        [Required]
        public Guid JobId { get; set; }

        [Required]
        public Guid JobSeekerId { get; set; }

        public string? ResumeText { get; set; }
        public List<string>? SeekerSkills { get; set; }
    }

    public class ApplicationResponseDto
    {
        public Guid Id { get; set; }
        public Guid JobId { get; set; }
        public Guid JobSeekerId { get; set; }
        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public int MatchScore { get; set; }
        public List<string> MatchedSkills { get; set; } = new();
        public List<string> MissingSkills { get; set; } = new();
        public string AiAnalysis { get; set; } = string.Empty;
    }
}
