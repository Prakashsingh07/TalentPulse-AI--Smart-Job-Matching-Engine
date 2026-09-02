using Microsoft.EntityFrameworkCore;
using JobPortal.API.Data;
using JobPortal.API.Models;

namespace JobPortal.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly JobPortalDbContext _context;

        public UserRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.SeekerProfile)
                .Include(u => u.EmployerProfile)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.SeekerProfile)
                .Include(u => u.EmployerProfile)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<List<User>> GetPendingEmployersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == UserRole.Employer && !u.IsApproved)
                .ToListAsync();
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task AddSeekerProfileAsync(JobSeekerProfile profile)
        {
            await _context.JobSeekerProfiles.AddAsync(profile);
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
