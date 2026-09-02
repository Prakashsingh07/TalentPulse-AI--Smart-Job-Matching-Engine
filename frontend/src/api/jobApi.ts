import { ApiClient } from './apiClient';
import { Job } from '../types';

export class JobApi {
  public static async getPublishedJobs(params?: { keyword?: string; location?: string; jobType?: string }): Promise<Job[]> {
    const query = new URLSearchParams();
    if (params?.keyword) query.append('keyword', params.keyword);
    if (params?.location) query.append('location', params.location);
    if (params?.jobType && params.jobType !== 'All') query.append('jobType', params.jobType);

    const qString = query.toString();
    return ApiClient.get<Job[]>(`/jobs${qString ? `?${qString}` : ''}`);
  }

  public static async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'status'>): Promise<Job> {
    return ApiClient.post<Job>('/jobs', jobData);
  }
}
