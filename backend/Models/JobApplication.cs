namespace JobPortal.API.Models
{
    public enum ApplicationStatus
    {
        Submitted,
        UnderReview,
        Shortlisted,
        Rejected
    }

    public class JobApplication
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid JobId { get; set; }
        public Job Job { get; set; } = null!;
        
        public Guid JobSeekerId { get; set; }
        public User JobSeeker { get; set; } = null!;

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;

        // AI Match Engine Score & Diagnostics
        public int MatchScore { get; set; } // 0 - 100%
        public string MatchedSkillsJson { get; set; } = "[]";
        public string MissingSkillsJson { get; set; } = "[]";
        public string AiAnalysis { get; set; } = string.Empty;
    }
}
