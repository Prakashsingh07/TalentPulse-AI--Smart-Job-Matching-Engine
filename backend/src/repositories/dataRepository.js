// In-Memory Repository Encapsulation (SRP & Repository Pattern)

let users = [
  {
    id: 'usr-admin-1',
    email: 'Prakash07',
    password: '1234',
    name: 'Prakash (System Administrator)',
    role: 'Admin',
    isApproved: true,
    createdAt: '2026-07-25T10:00:00Z'
  },
  {
    id: 'usr-emp-1',
    email: 'employer@nexustech.io',
    password: '1234',
    name: 'David Miller',
    role: 'Employer',
    companyName: 'Nexus Tech Solutions',
    isApproved: true,
    createdAt: '2026-07-26T10:00:00Z'
  },
  {
    id: 'usr-seeker-1',
    email: 'student@dev.com',
    password: '1234',
    name: 'Alex Vance (Student)',
    role: 'JobSeeker',
    isApproved: true,
    createdAt: '2026-07-27T10:00:00Z'
  }
];

let jobs = [
  {
    id: 'job-1',
    employerId: 'usr-emp-1',
    companyName: 'Nexus Tech Solutions',
    title: 'Senior Full Stack Developer (React + C# .NET)',
    department: 'Engineering',
    description: 'Seeking an ambitious Senior Full Stack Developer to architect cloud applications using React.js and ASP.NET Core Web API backed by SQL Server.',
    requirements: [
      '5+ years experience with React.js and TypeScript',
      'Strong proficiency in C# and ASP.NET Core Web API',
      'Extensive experience with SQL Server schema design & Entity Framework Core'
    ],
    skillsRequired: ['React', 'TypeScript', 'C#', '.NET Core', 'SQL Server', 'REST API'],
    location: 'Remote / New York, NY',
    jobType: 'Full-time',
    salaryRange: '$120,000 - $155,000 / year',
    status: 'Published',
    createdAt: '2026-07-28T10:00:00Z',
    applicationsCount: 1
  },
  {
    id: 'job-2',
    employerId: 'usr-emp-1',
    companyName: 'Nexus Tech Solutions',
    title: 'Lead Frontend Engineer (React & UI Design)',
    department: 'Product Development',
    description: 'Join Nexus Tech as Lead Frontend Architect crafting state-of-the-art UI/UX interfaces with React, TypeScript, and high-performance CSS animations.',
    requirements: [
      '4+ years building complex web apps in React JS',
      'Deep knowledge of TypeScript, CSS design systems, and responsive design'
    ],
    skillsRequired: ['React', 'TypeScript', 'CSS', 'HTML', 'REST API'],
    location: 'Hybrid / Austin, TX',
    jobType: 'Full-time',
    salaryRange: '$115,000 - $140,000 / year',
    status: 'Published',
    createdAt: '2026-07-29T14:30:00Z',
    applicationsCount: 0
  },
  {
    id: 'job-3',
    employerId: 'usr-emp-2',
    companyName: 'Innovate AI Labs',
    title: 'AI & Data Science NLP Engineer',
    department: 'Research & Intelligence',
    description: 'Innovate AI Labs is building next-generation NLP semantic algorithms and smart resume matching models.',
    requirements: [
      'Knowledge of NLP, TF-IDF, text tokenization, and cosine similarity',
      'Proficiency in Python or C# .NET'
    ],
    skillsRequired: ['NLP', 'Machine Learning', 'Python', 'C#'],
    location: 'Remote',
    jobType: 'Contract',
    salaryRange: '$130,000 - $160,000 / year',
    status: 'PendingApproval',
    createdAt: '2026-07-31T09:15:00Z',
    applicationsCount: 0
  }
];

let applications = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobSeekerId: 'usr-seeker-1',
    applicantName: 'Alex Vance',
    applicantEmail: 'alex.developer@gmail.com',
    appliedAt: '2026-07-30T16:45:00Z',
    status: 'Shortlisted',
    matchScore: 94,
    matchedSkills: ['React', 'TypeScript', 'C#', '.NET Core', 'SQL Server', 'REST API'],
    missingSkills: [],
    aiAnalysis: 'Exceptional fit (94% Match)! Possesses all required tech stack skills (React, C#, SQL Server).'
  }
];

export const dataRepository = {
  // User methods
  getUsers: () => users,
  findUserByEmail: (email) => users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()),
  findUserById: (id) => users.find(u => u.id === id),
  addUser: (user) => { users.push(user); return user; },
  
  // Job methods
  getJobs: () => jobs,
  findJobById: (id) => jobs.find(j => j.id === id),
  addJob: (job) => { jobs.unshift(job); return job; },
  
  // Application methods
  getApplications: () => applications,
  addApplication: (app) => { applications.unshift(app); return app; }
};
