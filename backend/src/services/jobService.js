import { dataRepository } from '../repositories/dataRepository.js';

export class JobService {
  static getPublishedJobs({ keyword, location, jobType }) {
    let result = dataRepository.getJobs().filter(j => j.status === 'Published');

    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(j => j.title.toLowerCase().includes(kw) || j.description.toLowerCase().includes(kw));
    }
    if (location) {
      result = result.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (jobType && jobType !== 'All') {
      result = result.filter(j => j.jobType === jobType);
    }

    return result;
  }

  static createJob(jobData) {
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: 'PendingApproval',
      createdAt: new Date().toISOString(),
      applicationsCount: 0
    };
    return dataRepository.addJob(newJob);
  }
}
