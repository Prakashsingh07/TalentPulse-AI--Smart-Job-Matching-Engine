using JobPortal.API.DTOs;
using JobPortal.API.Models;

namespace JobPortal.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    }
}
