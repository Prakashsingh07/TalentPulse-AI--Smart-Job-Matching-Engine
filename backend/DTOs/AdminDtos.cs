using JobPortal.API.Models;

namespace JobPortal.API.DTOs
{
    public class PendingEmployerDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SystemMetricsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveSeekers { get; set; }
        public int TotalEmployers { get; set; }
        public int PendingApprovals { get; set; }
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; }
        public double AverageMatchRate { get; set; }
    }
}
