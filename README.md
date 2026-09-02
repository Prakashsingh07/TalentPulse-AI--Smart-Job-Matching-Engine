# 🚀 TalentPulse AI - Smart Job Matching Engine

> An enterprise-grade, full-stack **Job Portal System** architected with **SOLID Principles**, connecting job seekers and employers with intelligent **NLP-based resume matching**, real-time **Cosine Similarity fit scoring**, **JWT Security**, and multi-stage **Admin Approval Workflows**.

---

## 🏗️ SOLID Architecture & Design Patterns

The codebase is built from the ground up following **SOLID Principles**:

1. **Single Responsibility Principle (SRP)**:
   - **Controllers**: Thin HTTP orchestrators handling request/response serialization.
   - **Services**: Dedicated domain logic for Authentication, Jobs, Applications, Admin workflows, and NLP matching.
   - **Repositories**: Isolated Entity Framework Core & database queries.
   - **Middleware**: Global exception handling (`ExceptionHandlingMiddleware`) handling cross-cutting concerns.
2. **Open/Closed Principle (OCP)**:
   - **Extensible NLP Strategy**: `ISkillExtractor` and `ITextSimilarityCalculator` strategy interfaces allow plugging in new NLP models (e.g. BERT or LLM vector embeddings) without modifying core matching logic.
3. **Liskov Substitution Principle (LSP)**:
   - Interface contracts (`IUserRepository`, `IJobRepository`, `IApplicationRepository`) allow seamless substitution between EF Core SQL Server, SQLite, or In-Memory implementations.
4. **Interface Segregation Principle (ISP)**:
   - Fine-grained service interfaces (`IAuthService`, `IJobService`, `IApplicationService`, `IAdminService`, `IPasswordHasher`, `IJwtTokenGenerator`).
5. **Dependency Inversion Principle (DIP)**:
   - Controllers and services depend strictly on interfaces injected via ASP.NET Core Dependency Injection.

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
| **Security** | JWT Bearer Tokens, SHA256/PBKDF2 Password Hashing |
| **Deployment** | Docker, Docker Compose, Nginx Reverse Proxy |
| **AI / NLP** | TF-IDF Vector Space Model, Cosine Similarity Algorithm, Skill Taxonomy Parser |

---

## 📁 Project Structure

```
TalentPulse-AI/
├── backend/                         # ASP.NET Core 8 API & Node Server (SOLID Architecture)
│   ├── Controllers/                 # HTTP API Controllers (Thin Orchestrators)
│   ├── DTOs/                        # Data Transfer Objects
│   ├── Data/                        # JobPortalDbContext & DbInitializer
│   ├── Middleware/                  # ExceptionHandlingMiddleware
│   ├── Models/                      # Domain Entities (User, Job, JobApplication)
│   ├── Repositories/                # Repository Abstraction Layer (DIP & LSP)
│   ├── Services/                    # Domain Business Logic & NLP Matching Engine
│   ├── appsettings.json             # Environment Config
│   ├── Dockerfile.backend           # Multi-Stage Backend Docker Build
│   ├── JobPortal.API.csproj
│   └── server.js                    # Modular Express Proxy Server
├── frontend/                        # React JS + TypeScript Frontend
│   ├── src/
│   │   ├── api/                     # API Client & Endpoint Abstractions
│   │   ├── components/              # Glassmorphic UI Components
│   │   ├── hooks/                   # Custom React Hooks (useAuth, useJobs, useApplications)
│   │   ├── pages/                   # Dashboards (Seeker, Employer, Admin)
│   │   ├── services/                # nlpEngine.ts, mockBackend.ts
│   │   ├── types/                   # TypeScript Interfaces
│   │   ├── App.tsx                  # App Router & State Manager
│   │   └── main.tsx
│   ├── Dockerfile.frontend          # Nginx Production Container
│   ├── nginx.conf                   # Nginx SPA Routing & Reverse Proxy
│   └── vite.config.ts
├── docker-compose.yml               # Container Orchestration (Frontend, Backend, SQL Server)
└── .env.example                     # Environment Configuration Template
```

---

## ⚡ Getting Started & Deployment

### 🐳 Option 1: 1-Click Production Deployment with Docker Compose (Recommended)

Run the full stack (Frontend + ASP.NET Core Web API + SQL Server Database) with a single command:

```bash
docker-compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **Backend API & Swagger**: `http://localhost:5000/swagger`

---

### 💻 Option 2: Local Development Setup

#### 1. Frontend Setup (React JS)
```bash
cd frontend
npm install
npm run dev
```
Access the frontend at `http://localhost:3000`.

#### 2. Backend Setup (.NET 8 Web API)
```bash
cd backend
dotnet restore
dotnet run
```
Access the Swagger UI at `http://localhost:5000/swagger` and Health Check at `http://localhost:5000/health`.

---

## 📜 License

Distributed under the MIT License. Created for **TalentPulse AI**.