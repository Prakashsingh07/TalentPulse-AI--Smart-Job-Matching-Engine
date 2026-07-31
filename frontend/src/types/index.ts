export type UserRole = 'JobSeeker' | 'Employer' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName?: string;
  isApproved?: boolean; // For employers
  avatarUrl?: string;
}

export interface JobSeekerProfile {
  headline: string;
  summary: string;
  skills: string[];
  experienceYears: number;
  education: string;
  resumeFileName?: string;
  resumeText?: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  location: string;
  website: string;
  description: string;
  verificationStatus: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export type JobStatus = 'PendingApproval' | 'Published' | 'Closed' | 'Rejected';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  department?: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  location: string;
  jobType: JobType;
  salaryRange: string;
  status: JobStatus;
  createdAt: string;
  applicationsCount: number;
}

export type ApplicationStatus = 'Submitted' | 'UnderReview' | 'Shortlisted' | 'Rejected';

export interface MatchDiagnostic {
  score: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: boolean;
  domainScore: number;
  summary: string;
  recommendation: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobSeekerId: string;
  applicantName: string;
  applicantEmail: string;
  applicantHeadline: string;
  applicantSkills: string[];
  resumeTextSnippet?: string;
  appliedAt: string;
  status: ApplicationStatus;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  aiAnalysis: string;
}

export interface SystemStats {
  totalUsers: number;
  totalSeekers: number;
  totalEmployers: number;
  pendingEmployers: number;
  totalJobs: number;
  pendingJobs: number;
  totalApplications: number;
  averageMatchScore: number;
}
