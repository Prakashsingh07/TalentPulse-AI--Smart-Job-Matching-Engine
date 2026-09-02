import { dataRepository } from '../repositories/dataRepository.js';

export class AdminService {
  static getPendingEmployers() {
    return dataRepository.getUsers().filter(u => u.role === 'Employer' && !u.isApproved);
  }

  static approveEmployer(id) {
    const user = dataRepository.findUserById(id);
    if (!user) throw new Error('User not found');
    user.isApproved = true;
    return user;
  }

  static getPendingJobs() {
    return dataRepository.getJobs().filter(j => j.status === 'PendingApproval');
  }

  static approveJob(id) {
    const job = dataRepository.findJobById(id);
    if (!job) throw new Error('Job not found');
    job.status = 'Published';
    return job;
  }

  static getMetrics() {
    const users = dataRepository.getUsers();
    const jobs = dataRepository.getJobs();
    const apps = dataRepository.getApplications();

    const seekers = users.filter(u => u.role === 'JobSeeker').length;
    const employers = users.filter(u => u.role === 'Employer').length;
    const pendingEmp = users.filter(u => u.role === 'Employer' && !u.isApproved).length;
    const pendingJobs = jobs.filter(j => j.status === 'PendingApproval').length;
    const activeJobs = jobs.filter(j => j.status === 'Published').length;
    const avgMatch = apps.length > 0 ? apps.reduce((a, b) => a + b.matchScore, 0) / apps.length : 85.0;

    return {
      totalUsers: users.length,
      activeSeekers: seekers,
      totalEmployers: employers,
      pendingApprovals: pendingEmp + pendingJobs,
      totalJobs: jobs.length,
      activeJobs,
      averageMatchRate: Math.round(avgMatch * 10) / 10
    };
  }
}
