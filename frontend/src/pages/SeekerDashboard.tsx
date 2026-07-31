import { JobApplication, JobSeekerProfile, User } from '../types';
import { UserCheck, FileText, Sparkles, CheckCircle2, AlertTriangle, Clock, Briefcase } from 'lucide-react';

interface SeekerDashboardProps {
  currentUser: User;
  profile: JobSeekerProfile;
  applications: JobApplication[];
  onOpenResumeModal: () => void;
  onExploreJobs: () => void;
}

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({
  currentUser,
  profile,
  applications,
  onOpenResumeModal,
  onExploreJobs
}) => {
  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'Shortlisted':
        return <span className="badge badge-emerald"><CheckCircle2 size={13} /> Shortlisted</span>;
      case 'UnderReview':
        return <span className="badge badge-amber"><Clock size={13} /> Under Review</span>;
      case 'Rejected':
        return <span className="badge badge-rose"><AlertTriangle size={13} /> Decision Made</span>;
      default:
        return <span className="badge badge-indigo"><Clock size={13} /> Submitted</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Top Banner Profile Summary */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
            alt={currentUser.name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid var(--primary)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.6rem' }}>{currentUser.name}</h2>
              <span className="badge badge-indigo">Candidate Profile</span>
            </div>
            <p style={{ color: '#38bdf8', fontWeight: 500, marginTop: '2px' }}>{profile.headline}</p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {profile.experienceYears} Years Experience • {profile.skills.length} Technical Skills Verified
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onOpenResumeModal}>
            <FileText size={16} color="#06b6d4" /> Update Resume AI
          </button>
          <button className="btn btn-primary" onClick={onExploreJobs}>
            <Briefcase size={16} /> Explore Recommended Jobs
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: My Job Applications Timeline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} color="var(--primary)" /> Applied Opportunities ({applications.length})
            </h3>
          </div>

          {applications.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Briefcase size={48} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.5 }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Job Applications Submitted Yet</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>Browse available positions and use AI matching to submit your resume.</p>
              <button className="btn btn-primary" onClick={onExploreJobs}>Explore Open Roles</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map(app => (
                <div key={app.id} className="glass-panel glass-panel-interactive" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{app.companyName}</span>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '2px', color: '#fff' }}>{app.jobTitle}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                        Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ marginBottom: '6px' }}>{getStatusBadge(app.status)}</div>
                      <span className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
                        <Sparkles size={13} /> {app.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* AI Analysis Summary */}
                  <div style={{ background: 'rgba(15, 22, 36, 0.6)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: '0.88rem', color: '#cbd5e1' }}>
                    💡 <strong>AI Screener Diagnostics:</strong> {app.aiAnalysis}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Verified Skills & Profile Card */}
        <div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--secondary)" /> Verified Resume Skills
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {profile.skills.map(skill => (
                <span key={skill} className="badge badge-indigo" style={{ padding: '6px 12px', fontSize: '0.82rem', textTransform: 'none' }}>
                  <CheckCircle2 size={13} /> {skill}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Resume Text Snippet</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                "{profile.resumeText ? profile.resumeText.slice(0, 300) + '...' : 'No resume uploaded yet.'}"
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
