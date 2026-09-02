import { ApiClient } from './apiClient';
import { JobApplication, MatchDiagnostic } from '../types';

export interface ApplyResponse {
  application: JobApplication;
  diagnostic: MatchDiagnostic;
}

export class ApplicationApi {
  public static async applyToJob(data: { jobId: string; jobSeekerId: string; resumeText?: string; seekerSkills?: string[]; applicantName?: string }): Promise<ApplyResponse> {
    return ApiClient.post<ApplyResponse>('/applications/apply', data);
  }

  public static async getApplicantsForJob(jobId: string): Promise<JobApplication[]> {
    return ApiClient.get<JobApplication[]>(`/applications/job/${jobId}`);
  }
}
