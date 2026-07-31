using JobPortal.API.Models;

namespace JobPortal.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(JobPortalDbContext context)
        {
            // Ensures SQL Server database and tables exist
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "Prakash07",
                PasswordHash = "1234",
                FullName = "Prakash (System Administrator)",
                Role = UserRole.Admin,
                IsApproved = true
            };

            var employerUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "hiring@nexustech.io",
                PasswordHash = "hashed_emp_pass",
                FullName = "David Miller",
                Role = UserRole.Employer,
                CompanyName = "Nexus Tech Solutions",
                IsApproved = true
            };

            var seekerUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "alex.developer@gmail.com",
                PasswordHash = "hashed_seeker_pass",
                FullName = "Alex Vance",
                Role = UserRole.JobSeeker,
                IsApproved = true
            };

            context.Users.AddRange(adminUser, employerUser, seekerUser);
            context.SaveChanges();

            var seekerProfile = new JobSeekerProfile
            {
                Id = Guid.NewGuid(),
                UserId = seekerUser.Id,
                Headline = "Senior Full Stack Developer | React, C# .NET Core & SQL Server Specialist",
                Summary = "5+ years experience building web apps with React, C#, ASP.NET Core, and SQL Server.",
                SkillsJson = "[\"React\", \"TypeScript\", \"C#\", \".NET Core\", \"ASP.NET\", \"SQL Server\", \"REST API\"]",
                ExperienceYears = 5,
                ResumeFileName = "Alex_Vance_Resume.pdf",
                ResumeTextContent = "Alex Vance - Senior Developer with React, C#, ASP.NET Core, and SQL Server skills."
            };

            context.JobSeekerProfiles.Add(seekerProfile);

            var job1 = new Job
            {
                Id = Guid.NewGuid(),
                EmployerId = employerUser.Id,
                CompanyName = "Nexus Tech Solutions",
                Title = "Senior Full Stack Developer (React + C# .NET)",
                Department = "Engineering",
                Description = "Architect scalable applications using React.js and ASP.NET Core Web API backed by SQL Server.",
                RequirementsJson = "[\"5+ years React.js & TypeScript\", \"Proficiency in C# ASP.NET Core\", \"SQL Server schema design & Entity Framework Core\"]",
                SkillsRequiredJson = "[\"React\", \"TypeScript\", \"C#\", \".NET Core\", \"SQL Server\", \"REST API\"]",
                Location = "Remote / New York, NY",
                JobType = "Full-time",
                SalaryRange = "$120,000 - $155,000 / year",
                Status = JobStatus.Published,
                CreatedAt = DateTime.UtcNow
            };

            context.Jobs.Add(job1);
            context.SaveChanges();
        }
    }
}
