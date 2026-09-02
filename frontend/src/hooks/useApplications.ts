import { useState, useEffect } from 'react';
import { JobApplication } from '../types';
import { mockBackend } from '../services/mockBackend';

export function useApplications(userId: string | undefined) {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const refreshApplications = () => {
    if (userId) {
      setApplications(mockBackend.getApplicationsForSeeker(userId));
    } else {
      setApplications([]);
    }
  };

  useEffect(() => {
    refreshApplications();
  }, [userId]);

  return { applications, refreshApplications };
}
