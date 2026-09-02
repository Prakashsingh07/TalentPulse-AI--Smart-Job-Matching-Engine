import { ApiClient } from './apiClient';
import { User, Job, SystemStats } from '../types';

export class AdminApi {
  public static async getPendingEmployers(): Promise<User[]> {
    return ApiClient.get<User[]>('/admin/pending-employers');
  }

  public static async approveEmployer(id: string): Promise<{ message: string; user: User }> {
    return ApiClient.post<{ message: string; user: User }>(`/admin/approve-employer/${id}`);
  }

  public static async getPendingJobs(): Promise<Job[]> {
    return ApiClient.get<Job[]>('/admin/pending-jobs');
  }

  public static async approveJob(id: string): Promise<{ message: string; job: Job }> {
    return ApiClient.post<{ message: string; job: Job }>(`/admin/approve-job/${id}`);
  }

  public static async getMetrics(): Promise<SystemStats> {
    return ApiClient.get<SystemStats>('/admin/metrics');
  }
}
