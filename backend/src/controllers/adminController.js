import { AdminService } from '../services/adminService.js';

export const adminController = {
  getPendingEmployers: (req, res) => {
    try {
      const pending = AdminService.getPendingEmployers();
      res.json(pending);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  approveEmployer: (req, res) => {
    try {
      const user = AdminService.approveEmployer(req.params.id);
      res.json({ message: 'Employer approved successfully', user });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  getPendingJobs: (req, res) => {
    try {
      const pending = AdminService.getPendingJobs();
      res.json(pending);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  approveJob: (req, res) => {
    try {
      const job = AdminService.approveJob(req.params.id);
      res.json({ message: 'Job published successfully', job });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  getMetrics: (req, res) => {
    try {
      const metrics = AdminService.getMetrics();
      res.json(metrics);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
