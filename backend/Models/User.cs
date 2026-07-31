namespace JobPortal.API.Models
{
    public enum UserRole
    {
        JobSeeker,
        Employer,
        Admin
    }

    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string? CompanyName { get; set; }
        public bool IsApproved { get; set; } = false; // Required for Employers
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public JobSeekerProfile? SeekerProfile { get; set; }
        public EmployerProfile? EmployerProfile { get; set; }
    }

    public class EmployerProfile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string CompanyName { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VerificationStatus { get; set; } = "Pending"; // Pending, Approved, Rejected
    }

    public class JobSeekerProfile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public string Headline { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string SkillsJson { get; set; } = "[]"; // Serialized JSON list of skills
        public int ExperienceYears { get; set; }
        public string? ResumeFileName { get; set; }
        public string? ResumeTextContent { get; set; }
    }
}
