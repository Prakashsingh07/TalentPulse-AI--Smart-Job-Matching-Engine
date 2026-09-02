using JobPortal.API.Models;

namespace JobPortal.API.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByEmailAsync(string email);
        Task<List<User>> GetPendingEmployersAsync();
        Task<List<User>> GetAllUsersAsync();
        Task AddUserAsync(User user);
        Task AddSeekerProfileAsync(JobSeekerProfile profile);
        Task UpdateUserAsync(User user);
        Task SaveChangesAsync();
    }
}
