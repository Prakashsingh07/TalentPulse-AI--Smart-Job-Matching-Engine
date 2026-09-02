import { useState, useEffect } from 'react';
import { Job } from '../types';
import { mockBackend } from '../services/mockBackend';

export function useJobs(keyword: string, location: string, jobType: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshJobs = () => {
    setLoading(true);
    try {
      const published = mockBackend.getJobs({
        status: 'Published',
        keyword,
        location,
        jobType
      });
      setJobs(published);

      const allJobs = mockBackend.getJobs({});
      setPendingJobs(allJobs.filter(j => j.status === 'PendingApproval'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshJobs();
  }, [keyword, location, jobType]);

  return { jobs, pendingJobs, loading, refreshJobs };
}
