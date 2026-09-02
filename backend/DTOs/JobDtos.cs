using System.ComponentModel.DataAnnotations;
using JobPortal.API.Models;

namespace JobPortal.API.DTOs
{
    public class CreateJobDto
    {
        [Required]
        public Guid EmployerId { get; set; }

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Department { get; set; } = "Engineering";

        [Required]
        public string Description { get; set; } = string.Empty;

        public List<string> Requirements { get; set; } = new();

        public List<string> SkillsRequired { get; set; } = new();

        public string Location { get; set; } = "Remote";

        public string JobType { get; set; } = "Full-time";

        public string SalaryRange { get; set; } = string.Empty;
    }

    public class JobResponseDto
    {
        public Guid Id { get; set; }
        public Guid EmployerId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Requirements { get; set; } = new();
        public List<string> SkillsRequired { get; set; } = new();
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string SalaryRange { get; set; } = string.Empty;
        public JobStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ApplicationsCount { get; set; }
    }

    public class JobQueryDto
    {
        public string? Keyword { get; set; }
        public string? Location { get; set; }
        public string? JobType { get; set; }
    }
}
