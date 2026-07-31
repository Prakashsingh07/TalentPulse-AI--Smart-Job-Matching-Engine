import React from 'react';
import { Job, JobSeekerProfile, User } from '../types';
import { MapPin, DollarSign, Briefcase, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Lock, FileWarning } from 'lucide-react';
import { calculateMatchDiagnostic } from '../services/nlpEngine';

interface JobCardProps {
  job: Job;
  currentUser: User | null;
  seekerProfile: JobSeekerProfile;
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onRequireAuth: () => void;
  onRequireResume: () => void;
  hasApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  currentUser,
  seekerProfile,
  onSelectJob,
  onApplyJob,
  onRequireAuth,
  onRequireResume,
  hasApplied
}) => {
  const hasResume = seekerProfile && seekerProfile.resumeText && seekerProfile.resumeText.trim().length >= 15;
  const isAuthenticated = currentUser !== null;

  // Calculate real-time AI Match Diagnostic ONLY if user is authenticated & has valid resume
  const matchDiag = (isAuthenticated && hasResume)
    ? calculateMatchDiagnostic(seekerProfile.resumeText || '', seekerProfile.skills, job)
    : null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    if (score >= 45) return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
    return { bg: 'rgba(244, 63, 94, 0.15)', text: '#f87171', border: 'rgba(244, 63, 94, 0.3)' };
  };

  const handleInspectClick = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    if (!hasResume && currentUser.role === 'JobSeeker') {
      onRequireResume();
      return;
    }
    onSelectJob(job);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    if (!hasResume && currentUser.role === 'JobSeeker') {
      onRequireResume();
      return;
    }
    onApplyJob(job);
  };

  return (
    <div className="glass-panel glass-panel-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      
      <div>
        {/* Header: Company & AI Match Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-glass)' }}
              />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
                {job.companyName.charAt(0)}
              </div>
            )}
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{job.companyName}</span>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginTop: '2px', lineHeight: 1.3 }}>{job.title}</h3>
            </div>
          </div>

          {/* AI Match Gauge Meter Guarded */}
          {isAuthenticated && hasResume && matchDiag ? (
            <div
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: getScoreColor(matchDiag.score).bg,
                border: `1px solid ${getScoreColor(matchDiag.score).border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              title="Precision AI Cosine Match Score"
            >
              <Sparkles size={15} color={getScoreColor(matchDiag.score).text} />
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: getScoreColor(matchDiag.score).text }}>{matchDiag.score}%</span>
                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)', marginTop: '-2px' }}>AI FIT</span>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <button
              onClick={onRequireAuth}
              className="badge badge-amber"
              style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '0.72rem', textTransform: 'none', border: '1px solid rgba(245, 158, 11, 0.4)' }}
            >
              <Lock size={12} /> Sign in for AI Fit
            </button>
          ) : (
            <button
              onClick={onRequireResume}
              className="badge badge-rose"
              style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '0.72rem', textTransform: 'none', border: '1px solid rgba(244, 63, 94, 0.4)' }}
            >
              <FileWarning size={12} /> Add Resume for Fit
            </button>
          )}

        </div>

        {/* Job Tags (Location, Salary, Type) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <span className="badge badge-cyan" style={{ textTransform: 'none' }}>
            <MapPin size={13} /> {job.location}
          </span>
          <span className="badge badge-indigo" style={{ textTransform: 'none' }}>
            <DollarSign size={13} /> {job.salaryRange}
          </span>
          <span className="badge badge-emerald" style={{ textTransform: 'none' }}>
            <Briefcase size={13} /> {job.jobType}
          </span>
        </div>

        {/* Description Snippet */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>

        {/* Skills Required Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {job.skillsRequired.map(skill => {
            const isMatched = matchDiag ? matchDiag.matchedSkills.some(m => m.toLowerCase() === skill.toLowerCase()) : false;
            return (
              <span
                key={skill}
                style={{
                  fontSize: '0.78rem',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: isMatched ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.05)',
                  color: isMatched ? '#6ee7b7' : 'var(--text-muted)',
                  border: isMatched ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-glass)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isMatched && <CheckCircle2 size={11} />} {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
        <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={handleInspectClick}>
          Inspect & AI Fit
        </button>

        {hasApplied ? (
          <button className="btn btn-sm" disabled style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'default' }}>
            <ShieldCheck size={14} /> Applied
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={handleApplyClick}>
            Quick Apply <ArrowRight size={14} />
          </button>
        )}
      </div>

    </div>
  );
};
