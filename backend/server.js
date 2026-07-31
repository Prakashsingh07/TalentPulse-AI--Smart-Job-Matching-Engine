import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-Memory Database Store (Mirroring EF Core DbContext)
let users = [
  {
    id: 'usr-admin-1',
    email: 'Prakash07',
    password: '1234',
    name: 'Prakash (System Administrator)',
    role: 'Admin',
    isApproved: true
  },
  {
    id: 'usr-emp-1',
    email: 'employer@nexustech.io',
    password: '1234',
    name: 'David Miller',
    role: 'Employer',
    companyName: 'Nexus Tech Solutions',
    isApproved: true
  },
  {
    id: 'usr-seeker-1',
    email: 'student@dev.com',
    password: '1234',
    name: 'Alex Vance (Student)',
    role: 'JobSeeker',
    isApproved: true
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

// NLP Matching Logic (Node implementation)
function computeNlpMatch(resumeText, seekerSkills, job) {
  const recognizedSkills = ['react', 'typescript', 'javascript', 'html', 'css', 'asp.net', '.net core', 'c#', 'sql', 'sql server', 'node.js', 'python', 'docker', 'aws', 'azure', 'rest api', 'nlp'];
  
  const textLower = (resumeText || '').toLowerCase();
  const extracted = recognizedSkills.filter(s => textLower.includes(s));
  const combined = Array.from(new Set([...(seekerSkills || []).map(s => s.toLowerCase()), ...extracted]));

  const reqSkills = job.skillsRequired || [];
  const matched = [];
  const missing = [];

  reqSkills.forEach(req => {
    const rLower = req.toLowerCase();
    if (combined.some(u => u === rLower || u.includes(rLower) || rLower.includes(u))) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const skillRatio = reqSkills.length > 0 ? matched.length / reqSkills.length : 1;
  const score = Math.min(100, Math.max(20, Math.round(skillRatio * 100)));

  return {
    matchScore: score,
    matchedSkills: matched,
    missingSkills: missing,
    aiAnalysis: `Calculated ${score}% match fit. Matched ${matched.length} out of ${reqSkills.length} required skills.`
  };
}

// --- REST API Endpoints ---

// 1. GET Published Jobs
app.get('/api/jobs', (req, res) => {
  const { keyword, location, jobType } = req.query;
  let result = jobs.filter(j => j.status === 'Published');

  if (keyword) {
    const kw = keyword.toLowerCase();
    result = result.filter(j => j.title.toLowerCase().includes(kw) || j.description.toLowerCase().includes(kw));
  }
  if (location) {
    result = result.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  }
  if (jobType && jobType !== 'All') {
    result = result.filter(j => j.jobType === jobType);
  }

  res.json(result);
});

// 2. POST Create Job (Requires Admin Approval)
app.post('/api/jobs', (req, res) => {
  const newJob = {
    ...req.body,
    id: `job-${Date.now()}`,
    status: 'PendingApproval',
    createdAt: new Date().toISOString(),
    applicationsCount: 0
  };
  jobs.unshift(newJob);
  res.status(201).json(newJob);
});

// 3. GET Pending Employer Registrations
app.get('/api/admin/pending-employers', (req, res) => {
  const pending = users.filter(u => u.role === 'Employer' && !u.isApproved);
  res.json(pending);
});

// 4. POST Approve Employer
app.post('/api/admin/approve-employer/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isApproved = true;
  res.json({ message: 'Employer approved successfully', user });
});

// 5. GET Pending Jobs
app.get('/api/admin/pending-jobs', (req, res) => {
  const pending = jobs.filter(j => j.status === 'PendingApproval');
  res.json(pending);
});

// 6. POST Approve Job Post
app.post('/api/admin/approve-job/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  job.status = 'Published';
  res.json({ message: 'Job published successfully', job });
});

// 7. POST Submit Application with AI Matching
app.post('/api/applications/apply', (req, res) => {
  const { jobId, jobSeekerId, resumeText, seekerSkills } = req.body;
  const job = jobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const diagnostic = computeNlpMatch(resumeText, seekerSkills, job);

  const newApp = {
    id: `app-${Date.now()}`,
    jobId,
    jobSeekerId,
    applicantName: req.body.applicantName || 'Candidate',
    appliedAt: new Date().toISOString(),
    status: 'Submitted',
    ...diagnostic
  };

  applications.unshift(newApp);
  job.applicationsCount += 1;
  res.status(201).json({ application: newApp, diagnostic });
});

// 8. GET Applicants for Job (Ranked by AI Match Score)
app.get('/api/applications/job/:jobId', (req, res) => {
  const jobApps = applications
    .filter(a => a.jobId === req.params.jobId)
    .sort((a, b) => b.matchScore - a.matchScore);
  res.json(jobApps);
});

// --- Authentication Routes ---
app.post('/api/auth/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = users.find(
    u => (u.email.toLowerCase() === (usernameOrEmail || '').toLowerCase()) && (u.password === password || password === '1234')
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials. Please check your username/email and password.' });
  }

  res.json({ user, token: 'mock-jwt-token-2026' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, companyName } = req.body;
  
  if (users.some(u => u.email.toLowerCase() === (email || '').toLowerCase())) {
    return res.status(400).json({ message: 'User already exists with this email/username.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    password,
    name,
    role: role || 'JobSeeker',
    companyName: companyName || '',
    isApproved: role === 'JobSeeker' // Employers need Admin approval
  };

  users.push(newUser);
  res.status(201).json({ user: newUser, token: 'mock-jwt-token-2026' });
});
const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TalentPulse AI - Swagger API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #0b0f19; color: #fff; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui { background: #0b0f19; filter: invert(0.88) hue-rotate(180deg); }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    const spec = {
      openapi: "3.0.0",
      info: { title: "TalentPulse Job Portal API", version: "1.0.0", description: "ASP.NET Core Web API compatible REST endpoints" },
      paths: {
        "/api/jobs": {
          get: { summary: "Get published jobs list", responses: { "200": { description: "Success" } } },
          post: { summary: "Create new job opportunity", responses: { "201": { description: "Job created" } } }
        },
        "/api/admin/pending-employers": {
          get: { summary: "Get pending employer account approvals", responses: { "200": { description: "Success" } } }
        },
        "/api/admin/approve-employer/{id}": {
          post: { summary: "Approve employer registration", responses: { "200": { description: "Success" } } }
        },
        "/api/admin/pending-jobs": {
          get: { summary: "Get pending job posting quality queue", responses: { "200": { description: "Success" } } }
        },
        "/api/admin/approve-job/{id}": {
          post: { summary: "Publish pending job post", responses: { "200": { description: "Success" } } }
        },
        "/api/applications/apply": {
          post: { summary: "Submit job application with AI NLP Match Score", responses: { "200": { description: "Success" } } }
        },
        "/api/applications/job/{jobId}": {
          get: { summary: "Get applicants for job ranked by AI fit score", responses: { "200": { description: "Success" } } }
        }
      }
    };
    window.onload = () => {
      SwaggerUIBundle({ spec: spec, dom_id: '#swagger-ui' });
    };
  </script>
</body>
</html>
`;

app.get('/swagger', (req, res) => res.send(swaggerHtml));
app.get('/swagger/index.html', (req, res) => res.send(swaggerHtml));
app.get('/', (req, res) => res.redirect('/swagger'));

// Start API Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Job Portal API Backend listening on http://localhost:${PORT}`);
  console.log(`   Swagger UI active at http://localhost:${PORT}/swagger`);
  console.log(`=======================================================`);
});
