using JobPortal.API.DTOs;
using JobPortal.API.Models;
using JobPortal.API.Repositories;

namespace JobPortal.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.UsernameOrEmail);
            if (user == null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            {
                throw new InvalidOperationException("Invalid username/email or password.");
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                CompanyName = user.CompanyName,
                IsApproved = user.IsApproved,
                Token = token
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existing = await _userRepository.GetByEmailAsync(dto.Email);
            if (existing != null)
            {
                throw new InvalidOperationException("User with this email/username already exists.");
            }

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = _passwordHasher.HashPassword(dto.Password),
                FullName = dto.FullName,
                Role = dto.Role,
                CompanyName = dto.CompanyName,
                IsApproved = dto.Role == UserRole.JobSeeker // Employers require Admin Approval
            };

            await _userRepository.AddUserAsync(newUser);

            if (dto.Role == UserRole.JobSeeker)
            {
                await _userRepository.AddSeekerProfileAsync(new JobSeekerProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = newUser.Id,
                    Headline = dto.Headline ?? "Software Developer",
                    SkillsJson = dto.SkillsJson ?? "[]"
                });
            }

            await _userRepository.SaveChangesAsync();

            var token = _jwtTokenGenerator.GenerateToken(newUser);

            return new AuthResponseDto
            {
                Id = newUser.Id,
                Email = newUser.Email,
                FullName = newUser.FullName,
                Role = newUser.Role,
                CompanyName = newUser.CompanyName,
                IsApproved = newUser.IsApproved,
                Token = token
            };
        }
    }
}
