import React from 'react';
import { Job, JobSeekerProfile } from '../types';
import { X, Sparkles, CheckCircle2, AlertTriangle, Briefcase, MapPin, DollarSign, ArrowRight, ShieldCheck, FileWarning } from 'lucide-react';
import { calculateMatchDiagnostic } from '../services/nlpEngine';

interface JobDetailModalProps {
  job: Job | null;
  seekerProfile: JobSeekerProfile;
  onClose: () => void;
  onApply: (job: Job) => void;
  onOpenResumeModal?: () => void;
  hasApplied: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  seekerProfile,
  onClose,
  onApply,
  onOpenResumeModal,
  hasApplied
}) => {
  if (!job) return null;

  const hasResume = seekerProfile && seekerProfile.resumeText && seekerProfile.resumeText.trim().length >= 15;

  const matchDiag = hasResume
    ? calculateMatchDiagnostic(seekerProfile.resumeText || '', seekerProfile.skills, job)
    : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          border: '1px solid var(--border-glow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: '#fff' }}>
              {job.companyName.charAt(0)}
            </div>
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{job.companyName} • {job.department || 'Tech'}</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '2px' }}>{job.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#9ca3af', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* AI Diagnostics Banner */}
        {hasResume && matchDiag ? (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="var(--secondary)" />
                <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Precision AI Candidate Match Diagnostic</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{matchDiag.score}%</span>
                <span className="badge badge-indigo">PRECISION COSINE FIT</span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
              <div
                style={{
                  width: `${matchDiag.score}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--secondary) 0%, var(--primary) 50%, var(--accent-emerald) 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.8s ease'
                }}
              />
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '12px' }}>
              {matchDiag.summary}
            </p>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--secondary)' }}>
              💡 <strong>AI Recommendation:</strong> {matchDiag.recommendation}
            </div>

            {/* Skill Gaps Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              {/* Matched Skills */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <CheckCircle2 size={14} /> MATCHED SKILLS ({matchDiag.matchedSkills.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matchDiag.matchedSkills.length > 0 ? (
                    matchDiag.matchedSkills.map(s => (
                      <span key={s} className="badge badge-emerald" style={{ fontSize: '0.75rem', textTransform: 'none' }}>{s}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None matched in resume</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <span style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <AlertTriangle size={14} /> SUGGESTED SKILL ADDITIONS ({matchDiag.missingSkills.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matchDiag.missingSkills.length > 0 ? (
                    matchDiag.missingSkills.map(s => (
                      <span key={s} className="badge badge-amber" style={{ fontSize: '0.75rem', textTransform: 'none' }}>{s}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>All core requirements matched!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileWarning size={22} color="#f87171" />
              <div>
                <h4 style={{ fontSize: '1rem', color: '#f87171' }}>Resume Required for Precision AI Fit Analysis</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload or paste your resume text to calculate your exact fit score for this position.</p>
              </div>
            </div>
            {onOpenResumeModal && (
              <button className="btn btn-secondary btn-sm" onClick={() => { onClose(); onOpenResumeModal(); }}>
                Upload Resume Now
              </button>
            )}
          </div>
        )}

        {/* Job Details Section */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan" style={{ padding: '6px 12px', textTransform: 'none' }}><MapPin size={15} /> {job.location}</span>
          <span className="badge badge-indigo" style={{ padding: '6px 12px', textTransform: 'none' }}><DollarSign size={15} /> {job.salaryRange}</span>
          <span className="badge badge-emerald" style={{ padding: '6px 12px', textTransform: 'none' }}><Briefcase size={15} /> {job.jobType}</span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Job Overview</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{job.description}</p>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Requirements & Responsibilities</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
            {(job.requirements || []).map((req, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          
          {hasApplied ? (
            <button className="btn" disabled style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <ShieldCheck size={18} /> Applied to this Job
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                onApply(job);
                onClose();
              }}
              style={{ padding: '12px 28px' }}
            >
              Submit Application with Resume AI <ArrowRight size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
