import { dataRepository } from '../repositories/dataRepository.js';
import { NlpService } from './nlpService.js';

export class ApplicationService {
  static applyToJob({ jobId, jobSeekerId, applicantName, resumeText, seekerSkills }) {
    const job = dataRepository.findJobById(jobId);
    if (!job) throw new Error('Job not found');

    const diagnostic = NlpService.computeNlpMatch(resumeText, seekerSkills, job);

    const newApp = {
      id: `app-${Date.now()}`,
      jobId,
      jobSeekerId,
      applicantName: applicantName || 'Candidate',
      appliedAt: new Date().toISOString(),
      status: 'Submitted',
      ...diagnostic
    };

    dataRepository.addApplication(newApp);
    job.applicationsCount += 1;

    return { application: newApp, diagnostic };
  }

  static getJobApplicants(jobId) {
    return dataRepository.getApplications()
      .filter(a => a.jobId === jobId)
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}
