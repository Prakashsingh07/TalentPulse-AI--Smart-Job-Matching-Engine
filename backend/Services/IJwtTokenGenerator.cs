using JobPortal.API.Models;

namespace JobPortal.API.Services
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}
