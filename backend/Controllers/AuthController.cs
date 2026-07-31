using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPortal.API.Data;
using JobPortal.API.Models;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JobPortalDbContext _context;

        public AuthController(JobPortalDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => (u.Email.ToLower() == dto.UsernameOrEmail.ToLower()) && u.PasswordHash == dto.Password);

            if (user == null)
            {
                return BadRequest("Invalid username/email or password.");
            }

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                user.CompanyName,
                user.IsApproved
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest("User with this email/username already exists.");
            }

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = dto.Password,
                FullName = dto.FullName,
                Role = dto.Role,
                CompanyName = dto.CompanyName,
                IsApproved = dto.Role == UserRole.JobSeeker // Employers require Admin Approval
            };

            _context.Users.Add(newUser);

            if (dto.Role == UserRole.JobSeeker)
            {
                _context.JobSeekerProfiles.Add(new JobSeekerProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = newUser.Id,
                    Headline = dto.Headline ?? "Software Developer",
                    SkillsJson = dto.SkillsJson ?? "[]"
                });
            }

            await _context.SaveChangesAsync();
            return Ok(newUser);
        }
    }

    public class LoginDto
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string? CompanyName { get; set; }
        public string? Headline { get; set; }
        public string? SkillsJson { get; set; }
    }
}
