namespace JobPortal.API.Models
{
    public enum JobStatus
    {
        PendingApproval,
        Published,
        Closed,
        Rejected
    }

    public class Job
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid EmployerId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string RequirementsJson { get; set; } = "[]"; // Serialized JSON string array
        public string SkillsRequiredJson { get; set; } = "[]"; // Serialized JSON string array
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = "Full-time";
        public string SalaryRange { get; set; } = string.Empty;
        public JobStatus Status { get; set; } = JobStatus.PendingApproval;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
}
