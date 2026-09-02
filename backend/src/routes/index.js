import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { jobController } from '../controllers/jobController.js';
import { applicationController } from '../controllers/applicationController.js';
import { adminController } from '../controllers/adminController.js';

const router = Router();

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Job Routes
router.get('/jobs', jobController.getPublishedJobs);
router.post('/jobs', jobController.createJob);

// Application Routes
router.post('/applications/apply', applicationController.applyToJob);
router.get('/applications/job/:jobId', applicationController.getJobApplicants);

// Admin Routes
router.get('/admin/pending-employers', adminController.getPendingEmployers);
router.post('/admin/approve-employer/:id', adminController.approveEmployer);
router.get('/admin/pending-jobs', adminController.getPendingJobs);
router.post('/admin/approve-job/:id', adminController.approveJob);
router.get('/admin/metrics', adminController.getMetrics);

export default router;
