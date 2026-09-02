using System.ComponentModel.DataAnnotations;
using JobPortal.API.Models;

namespace JobPortal.API.DTOs
{
    public class LoginDto
    {
        [Required]
        public string UsernameOrEmail { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(4)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.JobSeeker;

        public string? CompanyName { get; set; }
        public string? Headline { get; set; }
        public string? SkillsJson { get; set; }
    }

    public class AuthResponseDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string? CompanyName { get; set; }
        public bool IsApproved { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
