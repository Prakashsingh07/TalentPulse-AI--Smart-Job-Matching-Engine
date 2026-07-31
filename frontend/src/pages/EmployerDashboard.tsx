import { useState } from 'react';
import { Job, JobApplication, User } from '../types';
import { Briefcase, Plus, Sparkles, Clock, Users, UserCheck, ShieldCheck, XCircle } from 'lucide-react';
import { mockBackend } from '../services/mockBackend';

interface EmployerDashboardProps {
  currentUser: User;
  jobs: Job[];
  onOpenPostJobModal: () => void;
  onRefreshData: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  currentUser,
  jobs,
  onOpenPostJobModal,
  onRefreshData
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const applicants = selectedJobId ? mockBackend.getApplicationsForJob(selectedJobId) : [];

  const handleUpdateStatus = (appId: string, status: JobApplication['status']) => {
    mockBackend.updateApplicationStatus(appId, status);
    onRefreshData();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Employer Top Header */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'}
            alt={currentUser.name}
            style={{ width: '72px', height: '72px', borderRadius: '16px', border: '2px solid var(--primary)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.6rem' }}>{currentUser.companyName}</h2>
              {currentUser.isApproved ? (
                <span className="badge badge-emerald"><ShieldCheck size={13} /> Verified Employer</span>
              ) : (
                <span className="badge badge-amber"><Clock size={13} /> Pending Verification</span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '2px' }}>
              Managed by {currentUser.name} • {jobs.length} Active Job Postings
            </p>
          </div>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={onOpenPostJobModal}
            disabled={!currentUser.isApproved}
            title={!currentUser.isApproved ? 'Awaiting Admin Account Approval' : ''}
            style={{ opacity: !currentUser.isApproved ? 0.6 : 1 }}
          >
            <Plus size={18} /> Post New Opportunity
          </button>
        </div>
      </div>

      {!currentUser.isApproved && (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={20} color="#fcd34d" />
          <div>
            <h4 style={{ fontSize: '1rem', color: '#fcd34d' }}>Account Approval Pending</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Your employer account is currently being reviewed by the System Administrator. Switch to the <strong>Admin Suite</strong> persona in the navbar above to approve this account instantly!
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }}>
        
        {/* Left Column: Manage Posted Jobs */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="var(--primary)" /> Posted Opportunities ({jobs.length})
          </h3>

          {jobs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No jobs posted yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {jobs.map(job => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    className="glass-panel"
                    onClick={() => setSelectedJobId(job.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--border-glow)' : '1px solid var(--border-glass)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1.05rem', color: isSelected ? '#a5b4fc' : '#fff' }}>{job.title}</h4>
                      {job.status === 'Published' && <span className="badge badge-emerald">Published</span>}
                      {job.status === 'PendingApproval' && <span className="badge badge-amber">Pending Admin</span>}
                      {job.status === 'Rejected' && <span className="badge badge-rose">Rejected</span>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>{job.jobType} • {job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontWeight: 600 }}>
                        <Users size={13} /> {job.applicationsCount} Applicants
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: AI Applicant Screener */}
        <div>
          {selectedJob ? (
            <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>AI Applicant Screener & Ranker</span>
                  <h3 style={{ fontSize: '1.4rem', marginTop: '2px' }}>{selectedJob.title}</h3>
                </div>
                <span className="badge badge-indigo" style={{ padding: '6px 12px' }}>
                  <Sparkles size={14} /> Ranked by AI Fit
                </span>
              </div>

              {applicants.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Users size={40} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <p style={{ color: 'var(--text-muted)' }}>No candidates have applied to this position yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {applicants.map(app => (
                    <div
                      key={app.id}
                      style={{
                        background: 'rgba(15, 22, 36, 0.8)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px'
                      }}
                    >
                      {/* Candidate Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>{app.applicantName}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{app.applicantHeadline}</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* AI Score Badge */}
                          <div style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'right' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{app.matchScore}%</span>
                            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)' }}>AI MATCH</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Diagnostics Summary */}
                      <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#a5b4fc', marginBottom: '14px' }}>
                        💡 <strong>Screener Diagnostic:</strong> {app.aiAnalysis}
                      </div>

                      {/* Skills match */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {app.matchedSkills.map(s => (
                          <span key={s} className="badge badge-emerald" style={{ fontSize: '0.75rem', textTransform: 'none' }}>✓ {s}</span>
                        ))}
                        {app.missingSkills.map(s => (
                          <span key={s} className="badge badge-amber" style={{ fontSize: '0.75rem', textTransform: 'none' }}>Gap: {s}</span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: <strong>{app.status}</strong></span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-accent-danger btn-sm"
                            onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                          <button
                            className="btn btn-accent-success btn-sm"
                            onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                          >
                            <UserCheck size={14} /> Shortlist Candidate
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>Select a job from the left panel to review candidate applications.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
