import { useState, useEffect } from 'react';
import { User, Job, JobSeekerProfile } from './types';
import { mockBackend } from './services/mockBackend';
import { useAuth } from './hooks/useAuth';
import { useJobs } from './hooks/useJobs';
import { useApplications } from './hooks/useApplications';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { PostJobModal } from './components/PostJobModal';
import { AuthModal } from './components/AuthModal';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Briefcase, Sparkles } from 'lucide-react';

export function App() {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('explore');

  // Search Filters
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Custom Hooks Data
  const { jobs, pendingJobs, refreshJobs } = useJobs(keyword, location, jobType);
  const { applications: myApplications, refreshApplications } = useApplications(currentUser?.id);

  // Additional State Data
  const [seekerProfile, setSeekerProfile] = useState<JobSeekerProfile>(mockBackend.getSeekerProfile());
  const [systemStats, setSystemStats] = useState(mockBackend.getSystemStats());
  const [pendingEmployers, setPendingEmployers] = useState<User[]>([]);

  // Modals
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const refreshData = () => {
    refreshJobs();
    refreshApplications();
    setSeekerProfile(mockBackend.getSeekerProfile());
    setSystemStats(mockBackend.getSystemStats());

    const allUsers = mockBackend.getAllUsers();
    setPendingEmployers(allUsers.filter(u => u.role === 'Employer' && !u.isApproved));
  };

  useEffect(() => {
    refreshData();
  }, [currentUser, keyword, location, jobType]);

  const handleLogout = () => {
    logout();
    setActiveTab('explore');
    showToast('You have signed out successfully.');
  };

  const handleToggleSkillTag = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleApplyToJob = (job: Job) => {
    try {
      const { diagnostic } = mockBackend.applyToJob(job.id);
      refreshData();
      showToast(`Applied to ${job.title}! AI Fit Score: ${diagnostic.score}%`);
    } catch (err: any) {
      showToast(err.message || 'Application failed');
    }
  };

  const handleSaveSeekerProfile = (updated: JobSeekerProfile) => {
    mockBackend.updateSeekerProfile(updated);
    refreshData();
    showToast('Profile & Resume AI skills synced!');
  };

  const handleSubmitNewJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'status'>) => {
    mockBackend.createJob(jobData);
    refreshData();
    showToast('Job created & submitted for Admin Approval!');
  };

  // Filter jobs by selected skill tags if any
  const filteredJobs = selectedSkills.length > 0
    ? jobs.filter(j => selectedSkills.some(s => j.skillsRequired.map(sr => sr.toLowerCase()).includes(s.toLowerCase())))
    : jobs;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Banner */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 200, background: 'rgba(18, 24, 38, 0.95)', border: '1px solid var(--border-glow)', padding: '14px 20px', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.92rem' }} className="animate-fade-in">
          <Sparkles size={18} color="#38bdf8" /> {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        pendingJobsCount={pendingJobs.length}
        pendingEmployersCount={pendingEmployers.length}
      />

      {/* Main Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'explore' && (
          <>
            <HeroSection
              keyword={keyword}
              setKeyword={setKeyword}
              location={location}
              setLocation={setLocation}
              jobType={jobType}
              setJobType={setJobType}
              onSearch={refreshData}
              selectedSkills={selectedSkills}
              onToggleSkillTag={handleToggleSkillTag}
            />

            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem' }}>Published Opportunities</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                    Showing {filteredJobs.length} verified tech jobs sorted by AI compatibility
                  </p>
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                  <Briefcase size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.4 }} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Matching Jobs Found</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search terms or skill filters.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                  {filteredJobs.map(job => {
                    const hasApplied = myApplications.some(a => a.jobId === job.id);
                    return (
                      <JobCard
                        key={job.id}
                        job={job}
                        currentUser={currentUser}
                        seekerProfile={seekerProfile}
                        onSelectJob={(j) => setSelectedJobForModal(j)}
                        onApplyJob={handleApplyToJob}
                        onRequireAuth={() => {
                          setIsAuthModalOpen(true);
                          showToast('Please Sign In or Create an Account to view AI Fit and Apply!');
                        }}
                        onRequireResume={() => {
                          setIsResumeModalOpen(true);
                          showToast('Please upload or paste your resume text to calculate AI Fit!');
                        }}
                        hasApplied={hasApplied}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'seeker-dashboard' && currentUser && (
          <SeekerDashboard
            currentUser={currentUser}
            profile={seekerProfile}
            applications={myApplications}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            onExploreJobs={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'employer-dashboard' && currentUser && (
          <EmployerDashboard
            currentUser={currentUser}
            jobs={mockBackend.getJobs({ employerId: currentUser.id })}
            onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
            onRefreshData={refreshData}
          />
        )}

        {activeTab === 'admin-dashboard' && currentUser && (
          <AdminDashboard
            stats={systemStats}
            pendingEmployers={pendingEmployers}
            pendingJobs={pendingJobs}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Modals */}
      <JobDetailModal
        job={selectedJobForModal}
        seekerProfile={seekerProfile}
        onClose={() => setSelectedJobForModal(null)}
        onApply={handleApplyToJob}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        hasApplied={selectedJobForModal ? myApplications.some(a => a.jobId === selectedJobForModal.id) : false}
      />

      <ResumeUploadModal
        profile={seekerProfile}
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSaveProfile={handleSaveSeekerProfile}
      />

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onSubmitJob={handleSubmitNewJob}
        companyName={currentUser?.companyName || 'Tech Company'}
        employerId={currentUser?.id || ''}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'Admin') setActiveTab('admin-dashboard');
          else if (user.role === 'Employer') setActiveTab('employer-dashboard');
          else setActiveTab('seeker-dashboard');
          showToast(`Welcome back, ${user.name}! Logged in as ${user.role}`);
        }}
      />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)' }}>
        TalentPulse AI Job Portal System • Powered by React.js + ASP.NET Core API + SQL Server & NLP Matching Engine
      </footer>

    </div>
  );
}
