import { ApiClient } from './apiClient';
import { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthApi {
  public static async login(usernameOrEmail: string, password?: string): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/login', { usernameOrEmail, password });
  }

  public static async register(userData: Partial<User>): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/register', userData);
  }
}
