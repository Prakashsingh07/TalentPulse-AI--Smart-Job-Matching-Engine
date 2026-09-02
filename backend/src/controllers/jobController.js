import { JobService } from '../services/jobService.js';

export const jobController = {
  getPublishedJobs: (req, res) => {
    try {
      const result = JobService.getPublishedJobs(req.query);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createJob: (req, res) => {
    try {
      const newJob = JobService.createJob(req.body);
      res.status(201).json(newJob);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
