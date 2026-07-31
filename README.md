# 🚀 TalentPulse AI - Smart Job Matching Engine

> An enterprise-grade, full-stack **Job Portal System** connecting job seekers and employers with intelligent **NLP-based resume matching**, real-time **Cosine Similarity fit scoring**, and multi-stage **Admin Approval Workflows**.

---

## 🌟 Key Capabilities

### 👨‍🎓 1. Student / Job Seeker Portal
- **Intelligent Job Search**: Filter published positions by keywords, location, employment type, and technical skill tags.
- **Precision AI Fit Diagnostics**: Inspect real-time **0-100% Cosine Fit Scores**, matched skills badges, missing skill gaps, and AI recommendations.
- **AI Resume Profiler**: Upload or paste resume text to automatically extract technical skills into candidate profile.
- **Application History Tracker**: Track application progress (`Submitted`, `UnderReview`, `Shortlisted`, `Rejected`) in real-time.

### 🏢 2. Employer Portal
- **Job Posting Management**: Create job opportunities with full Job Description (JD), salary ranges, qualifications, and required skill tags.
- **Employer Verification Workflow**: Employer accounts undergo admin verification before publishing jobs.
- **Smart AI Applicant Screener**: Candidate applications are automatically **ranked by highest AI Match Score** descending.
- **1-Click Screener Actions**: Review candidate resume diagnostics and instantly **Shortlist** or **Reject** applicants.

### 🛡️ 3. System Admin Suite
- **Employer Verification Queue**: Review and 1-click **Approve** or **Reject** new employer account registrations.
- **Job Posting Approval Queue**: Perform quality audit on employer job submissions before publishing to students.
- **System Control Center & Metrics**: Live analytics dashboard monitoring total users, active seekers, employers, pending approvals, total jobs, and average AI match rate.

---

## 🧠 Precision AI NLP Matching Algorithm

The system features a dual-weighted Natural Language Processing vector matching engine:

$$\text{Final AI Match Score} = \text{Skill Match Ratio (60\%)} + \text{TF-IDF Cosine Similarity (40\%)}$$

1. **Skill Taxonomy Extraction (60% Weight)**: Case-insensitive extraction comparing candidate skills against job JD `skillsRequired`.
2. **TF-IDF Term Frequency & Cosine Vector Distance (40% Weight)**: Measures text similarity between normalized resume tokens and full job specifications (`title` + `description` + `requirements`).
3. **Strict Validation Guards**: Guests or candidates without a valid uploaded resume must sign in and upload a resume before calculating fit scores.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React JS, TypeScript, Vite, Custom Glassmorphism CSS System, Lucide Icons |
| **Backend API** | C# ASP.NET Core 8 Web API, Express Node.js API Proxy |
| **Database & ORM** | Microsoft SQL Server (SSMS), Entity Framework Core 8, SQLite |
| **AI / NLP** | TF-IDF Vector Space Model, Cosine Similarity Algorithm, Skill Taxonomy Parser |

---

## 📁 Project Structure

```
TalentPulse-AI/
├── backend/                         # ASP.NET Core 8 API & Node Server
│   ├── Controllers/                 # Auth, Jobs, Admin, Applications Controllers
│   ├── Data/                        # JobPortalDbContext.cs & DbInitializer.cs
│   ├── Models/                      # User, Job, Application, Profile Entities
│   ├── Services/                    # NlpMatchingEngine.cs (C# Cosine Engine)
│   ├── appsettings.json             # Application Configuration
│   ├── server.js                    # API Proxy & Swagger Documentation
│   └── JobPortal.API.csproj
└── frontend/                        # React JS + TypeScript Frontend
    ├── src/
    │   ├── components/              # Navbar, HeroSection, JobCard, Modals, AuthModal
    │   ├── pages/                   # SeekerDashboard, EmployerDashboard, AdminDashboard
    │   ├── services/                # nlpEngine.ts, mockBackend.ts
    │   ├── styles/                  # index.css (Glassmorphic Theme)
    │   ├── types/                   # TypeScript Type Definitions
    │   ├── App.tsx                  # App Router & State Manager
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: v18+ and npm
- **.NET SDK**: v8.0+ (Optional for C# API)
- **SQL Server**: SSMS (Localhost / Named Instance)

---

### 2. Frontend Setup (React JS)
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:3000`.

---

### 3. Backend Setup (ASP.NET Core 8 Web API)
```bash
cd backend
dotnet restore
dotnet run
```
Access the Swagger UI at `http://localhost:5000/swagger`.

---

## 🗄️ Database Configuration

Configure your database connection string in `backend/appsettings.json` or environment configuration:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=YOUR_DATABASE_NAME;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

Tables (`Users`, `EmployerProfiles`, `JobSeekerProfiles`, `Jobs`, `Applications`) are automatically initialized on API startup via `DbInitializer.cs`.

---

## 📜 License

Distributed under the MIT License. Created for **TalentPulse AI**.