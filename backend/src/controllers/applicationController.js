import { ApplicationService } from '../services/applicationService.js';

export const applicationController = {
  applyToJob: (req, res) => {
    try {
      const result = ApplicationService.applyToJob(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getJobApplicants: (req, res) => {
    try {
      const result = ApplicationService.getJobApplicants(req.params.jobId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
