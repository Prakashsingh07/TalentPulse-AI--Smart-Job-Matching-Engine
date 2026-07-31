import { User, Job, JobApplication, JobSeekerProfile, SystemStats } from '../types';
import { calculateMatchDiagnostic } from './nlpEngine';

const STORAGE_KEYS = {
  USERS: 'job_portal_users_v2',
  JOBS: 'job_portal_jobs_v2',
  APPLICATIONS: 'job_portal_applications_v2',
  EMPLOYERS: 'job_portal_employers_v2',
  SEEKER_PROFILE: 'job_portal_seeker_profile_v2',
  CURRENT_USER: 'job_portal_current_user_v2'
};

const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'Prakash07',
    name: 'Prakash (System Administrator)',
    role: 'Admin',
    isApproved: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'usr-emp-1',
    email: 'employer@nexustech.io',
    name: 'David Miller',
    role: 'Employer',
    companyName: 'Nexus Tech Solutions',
    isApproved: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'usr-seeker-1',
    email: 'student@dev.com',
    name: 'Alex Vance (Student)',
    role: 'JobSeeker',
    isApproved: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  }
];

const INITIAL_SEEKER_PROFILE: JobSeekerProfile = {
  headline: 'Senior Full Stack Developer | React, C# .NET Core & SQL Server Specialist',
  summary: 'Passionate software engineer with 5+ years of experience designing scalable web apps, microservices, and database solutions using React, TypeScript, ASP.NET Core, and SQL Server.',
  skills: ['React', 'TypeScript', 'C#', '.NET Core', 'ASP.NET', 'SQL Server', 'REST API', 'Git', 'Docker', 'HTML', 'CSS'],
  experienceYears: 5,
  education: 'B.S. in Computer Science - Tech Institute (2020)',
  resumeFileName: 'Alex_Vance_FullStack_Resume.pdf',
  resumeText: `Alex Vance - Senior Software Engineer
Summary: Experienced Full-Stack Developer specializing in React.js, TypeScript, C#, ASP.NET Core API, SQL Server, and Cloud Architecture. Proven track record in building high-performing web platforms, scalable microservices, and NLP data pipelines.

Technical Skills:
- Frontend: React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind
- Backend: C#, ASP.NET Core Web API, Entity Framework Core, Node.js, REST APIs
- Database: SQL Server, PostgreSQL, Query Optimization, Stored Procedures
- DevOps & Tools: Git, Docker, CI/CD, Azure, AWS, Agile/Scrum

Experience:
Senior Developer @ CloudMatrix Solutions (2022 - Present)
- Engineered responsive React UI consuming ASP.NET Core APIs serving 100k daily users.
- Optimized SQL Server database queries reducing latency by 45%.
- Implemented JWT authentication and role-based access control (RBAC).`
};

const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    employerId: 'usr-emp-1',
    companyName: 'Nexus Tech Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
    title: 'Senior Full Stack Developer (React + C# .NET)',
    department: 'Engineering',
    description: 'We are seeking an ambitious Senior Full Stack Developer to architect and deliver scalable cloud applications using React.js and ASP.NET Core Web API backed by SQL Server.',
    requirements: [
      '5+ years experience with React.js and TypeScript',
      'Strong proficiency in C# and ASP.NET Core Web API',
      'Extensive experience with SQL Server schema design & Entity Framework Core',
      'Solid understanding of RESTful API architecture and JWT auth'
    ],
    skillsRequired: ['React', 'TypeScript', 'C#', '.NET Core', 'SQL Server', 'REST API'],
    location: 'Remote / New York, NY',
    jobType: 'Full-time',
    salaryRange: '$120,000 - $155,000 / year',
    status: 'Published',
    createdAt: '2026-07-28T10:00:00Z',
    applicationsCount: 4
  },
  {
    id: 'job-2',
    employerId: 'usr-emp-1',
    companyName: 'Nexus Tech Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
    title: 'Lead Frontend Engineer (React & UI Design)',
    department: 'Product Development',
    description: 'Join Nexus Tech as Lead Frontend Architect crafting state-of-the-art UI/UX interfaces with React, TypeScript, and high-performance CSS animations.',
    requirements: [
      '4+ years building complex web apps in React JS',
      'Deep knowledge of TypeScript, CSS design systems, and responsive design',
      'Experience with REST API consumption and state management'
    ],
    skillsRequired: ['React', 'TypeScript', 'CSS', 'HTML', 'REST API', 'Git'],
    location: 'Hybrid / Austin, TX',
    jobType: 'Full-time',
    salaryRange: '$115,000 - $140,000 / year',
    status: 'Published',
    createdAt: '2026-07-29T14:30:00Z',
    applicationsCount: 2
  },
  {
    id: 'job-3',
    employerId: 'usr-emp-2',
    companyName: 'Innovate AI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=120',
    title: 'AI & Data Science NLP Engineer',
    department: 'Research & Intelligence',
    description: 'Innovate AI Labs is building next-generation NLP semantic algorithms and smart resume matching models. Looking for NLP experts with Python/C# background.',
    requirements: [
      'Strong knowledge of NLP, TF-IDF, text tokenization, and cosine similarity',
      'Proficiency in Python or C# .NET',
      'Experience building vector search and intelligent recommendation engines'
    ],
    skillsRequired: ['NLP', 'Machine Learning', 'Python', 'C#', 'REST API'],
    location: 'Remote',
    jobType: 'Contract',
    salaryRange: '$130,000 - $160,000 / year',
    status: 'PendingApproval', // Pending Admin Approval
    createdAt: '2026-07-31T09:15:00Z',
    applicationsCount: 0
  },
  {
    id: 'job-4',
    employerId: 'usr-emp-1',
    companyName: 'Nexus Tech Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
    title: 'Database Administrator & SQL Architect',
    department: 'Infrastructure',
    description: 'Responsible for SQL Server database architecture, indexing, query performance tuning, and backup strategies.',
    requirements: [
      'Expertise in SQL Server DB optimization & T-SQL query tuning',
      'Experience with EF Core & ASP.NET Core integration'
    ],
    skillsRequired: ['SQL Server', 'SQL', '.NET Core', 'Entity Framework'],
    location: 'On-site / Chicago, IL',
    jobType: 'Full-time',
    salaryRange: '$100,000 - $125,000 / year',
    status: 'Published',
    createdAt: '2026-07-30T11:20:00Z',
    applicationsCount: 1
  }
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Full Stack Developer (React + C# .NET)',
    companyName: 'Nexus Tech Solutions',
    jobSeekerId: 'usr-seeker-1',
    applicantName: 'Alex Vance',
    applicantEmail: 'alex.developer@gmail.com',
    applicantHeadline: 'Senior Full Stack Developer | React, C# .NET Core & SQL Server Specialist',
    applicantSkills: ['React', 'TypeScript', 'C#', '.NET Core', 'ASP.NET', 'SQL Server', 'REST API'],
    resumeTextSnippet: 'Alex Vance - Experienced Full-Stack Developer specializing in React.js, TypeScript, C#, ASP.NET Core API, SQL Server...',
    appliedAt: '2026-07-30T16:45:00Z',
    status: 'Shortlisted',
    matchScore: 94,
    matchedSkills: ['React', 'TypeScript', 'C#', '.NET Core', 'SQL Server', 'REST API'],
    missingSkills: [],
    aiAnalysis: 'Exceptional fit (94% Match)! Possesses all required tech stack skills (React, C#, SQL Server, REST API). Strong candidate for interview.'
  }
];

class MockBackendService {
  private users: User[];
  private jobs: Job[];
  private applications: JobApplication[];
  private currentUser: User | null;
  private seekerProfile: JobSeekerProfile;

  constructor() {
    this.users = this.load(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.jobs = this.load(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    this.applications = this.load(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    this.seekerProfile = this.load(STORAGE_KEYS.SEEKER_PROFILE, INITIAL_SEEKER_PROFILE);
    this.currentUser = this.load<User | null>(STORAGE_KEYS.CURRENT_USER, null); // Default to signed out / guest
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    try {
      if (data === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      console.error('Storage save error', e);
    }
  }

  // --- Authentication ---
  login(usernameOrEmail: string, _pass?: string): User | null {
    const user = this.users.find(
      u => u.email.toLowerCase() === usernameOrEmail.trim().toLowerCase()
    );
    if (!user) return null;

    this.currentUser = user;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    return user;
  }

  logout(): void {
    this.currentUser = null;
    this.save(STORAGE_KEYS.CURRENT_USER, null);
  }

  register(data: { name: string; email: string; password?: string; role: User['role']; companyName?: string }): User {
    if (this.users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      throw new Error('User already exists with this email/username.');
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      companyName: data.companyName,
      isApproved: data.role === 'JobSeeker', // Employers require Admin approval
      avatarUrl: data.role === 'Employer'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };

    this.users.push(newUser);
    this.save(STORAGE_KEYS.USERS, this.users);

    this.currentUser = newUser;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    return newUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  switchUserRole(role: User['role']): User {
    let targetUser = this.users.find(u => u.role === role);
    if (!targetUser) {
      targetUser = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[3];
    }
    this.currentUser = targetUser;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    return this.currentUser;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  approveEmployer(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isApproved = true;
      this.save(STORAGE_KEYS.USERS, this.users);
    }
  }

  rejectEmployer(userId: string): void {
    this.users = this.users.filter(u => u.id !== userId);
    this.save(STORAGE_KEYS.USERS, this.users);
  }

  // --- Jobs ---
  getJobs(filters?: {
    keyword?: string;
    location?: string;
    jobType?: string;
    skills?: string[];
    status?: Job['status'];
    employerId?: string;
  }): Job[] {
    let result = [...this.jobs];

    if (filters) {
      if (filters.status) {
        result = result.filter(j => j.status === filters.status);
      }
      if (filters.employerId) {
        result = result.filter(j => j.employerId === filters.employerId);
      }
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        result = result.filter(
          j =>
            j.title.toLowerCase().includes(kw) ||
            j.description.toLowerCase().includes(kw) ||
            j.companyName.toLowerCase().includes(kw)
        );
      }
      if (filters.jobType && filters.jobType !== 'All') {
        result = result.filter(j => j.jobType === filters.jobType);
      }
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        result = result.filter(j => j.location.toLowerCase().includes(loc));
      }
    }

    return result;
  }

  getJobById(jobId: string): Job | undefined {
    return this.jobs.find(j => j.id === jobId);
  }

  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'status'>): Job {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: 'PendingApproval', // Must be approved by Admin
      createdAt: new Date().toISOString(),
      applicationsCount: 0
    };

    this.jobs.unshift(newJob);
    this.save(STORAGE_KEYS.JOBS, this.jobs);
    return newJob;
  }

  approveJob(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'Published';
      this.save(STORAGE_KEYS.JOBS, this.jobs);
    }
  }

  rejectJob(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'Rejected';
      this.save(STORAGE_KEYS.JOBS, this.jobs);
    }
  }

  // --- Resume & Seeker Profile ---
  getSeekerProfile(): JobSeekerProfile {
    return this.seekerProfile;
  }

  updateSeekerProfile(profile: Partial<JobSeekerProfile>): JobSeekerProfile {
    this.seekerProfile = { ...this.seekerProfile, ...profile };
    this.save(STORAGE_KEYS.SEEKER_PROFILE, this.seekerProfile);
    return this.seekerProfile;
  }

  // --- Applications & AI Matching ---
  applyToJob(jobId: string): { application: JobApplication; diagnostic: any } {
    const job = this.getJobById(jobId);
    if (!job) throw new Error('Job not found');

    const profile = this.getSeekerProfile();
    const diagnostic = calculateMatchDiagnostic(profile.resumeText || '', profile.skills, job);

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      jobSeekerId: this.currentUser?.id || 'usr-seeker-1',
      applicantName: this.currentUser?.name || 'Candidate',
      applicantEmail: this.currentUser?.email || 'candidate@email.com',
      applicantHeadline: profile.headline,
      applicantSkills: profile.skills,
      resumeTextSnippet: profile.resumeText ? profile.resumeText.slice(0, 200) + '...' : '',
      appliedAt: new Date().toISOString(),
      status: 'Submitted',
      matchScore: diagnostic.score,
      matchedSkills: diagnostic.matchedSkills,
      missingSkills: diagnostic.missingSkills,
      aiAnalysis: `${diagnostic.summary} ${diagnostic.recommendation}`
    };

    this.applications.unshift(newApp);
    this.save(STORAGE_KEYS.APPLICATIONS, this.applications);

    // Update applications count on job
    job.applicationsCount += 1;
    this.save(STORAGE_KEYS.JOBS, this.jobs);

    return { application: newApp, diagnostic };
  }

  getApplicationsForSeeker(seekerId: string): JobApplication[] {
    return this.applications.filter(a => a.jobSeekerId === seekerId);
  }

  getApplicationsForJob(jobId: string): JobApplication[] {
    return this.applications
      .filter(a => a.jobId === jobId)
      .sort((a, b) => b.matchScore - a.matchScore); // Rank by AI Match Score descending
  }

  updateApplicationStatus(appId: string, status: JobApplication['status']): void {
    const app = this.applications.find(a => a.id === appId);
    if (app) {
      app.status = status;
      this.save(STORAGE_KEYS.APPLICATIONS, this.applications);
    }
  }

  // --- Admin Analytics ---
  getSystemStats(): SystemStats {
    const totalSeekers = this.users.filter(u => u.role === 'JobSeeker').length;
    const employers = this.users.filter(u => u.role === 'Employer');
    const pendingEmployers = employers.filter(e => !e.isApproved).length;

    const pendingJobs = this.jobs.filter(j => j.status === 'PendingApproval').length;
    
    const avgScore = this.applications.length > 0
      ? Math.round(this.applications.reduce((acc, curr) => acc + curr.matchScore, 0) / this.applications.length)
      : 0;

    return {
      totalUsers: this.users.length,
      totalSeekers,
      totalEmployers: employers.length,
      pendingEmployers,
      totalJobs: this.jobs.length,
      pendingJobs,
      totalApplications: this.applications.length,
      averageMatchScore: avgScore
    };
  }
}

export const mockBackend = new MockBackendService();
