import { useState, useEffect } from 'react';
import { User } from '../types';
import { mockBackend } from '../services/mockBackend';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => mockBackend.getCurrentUser());

  useEffect(() => {
    const user = mockBackend.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const login = async (user: User, token?: string) => {
    mockBackend.setCurrentUser(user);
    if (token) {
      localStorage.setItem('tp_auth_token', token);
    }
    setCurrentUser(user);
  };

  const logout = () => {
    mockBackend.logout();
    localStorage.removeItem('tp_auth_token');
    setCurrentUser(null);
  };

  return { currentUser, setCurrentUser, login, logout };
}
