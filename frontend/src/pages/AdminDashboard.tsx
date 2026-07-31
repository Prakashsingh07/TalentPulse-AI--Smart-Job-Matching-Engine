import { Job, User, SystemStats } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Users, Briefcase, Sparkles, Clock, Building } from 'lucide-react';
import { mockBackend } from '../services/mockBackend';

interface AdminDashboardProps {
  stats: SystemStats;
  pendingEmployers: User[];
  pendingJobs: Job[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  pendingEmployers,
  pendingJobs,
  onRefreshData
}) => {
  const handleApproveEmployer = (userId: string) => {
    mockBackend.approveEmployer(userId);
    onRefreshData();
  };

  const handleRejectEmployer = (userId: string) => {
    mockBackend.rejectEmployer(userId);
    onRefreshData();
  };

  const handleApproveJob = (jobId: string) => {
    mockBackend.approveJob(jobId);
    onRefreshData();
  };

  const handleRejectJob = (jobId: string) => {
    mockBackend.rejectJob(jobId);
    onRefreshData();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Admin Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <span className="badge badge-indigo" style={{ padding: '6px 14px', marginBottom: '8px' }}>
            <ShieldCheck size={14} /> System Administrator Portal
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '4px' }}>Approval & Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage employer verification requests, job posting quality approvals, and system metrics.</p>
        </div>
      </div>

      {/* KPI System Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Users</span>
            <Users size={20} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>{stats.totalUsers}</h3>
          <span style={{ fontSize: '0.78rem', color: '#a5b4fc' }}>{stats.totalSeekers} Seekers • {stats.totalEmployers} Employers</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Employers</span>
            <Clock size={20} color="var(--accent-amber)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', color: '#fcd34d' }}>{stats.pendingEmployers}</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Awaiting Verification</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Job Posts</span>
            <Briefcase size={20} color="var(--secondary)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', color: '#67e8f9' }}>{stats.pendingJobs}</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Requires Quality Audit</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI Match Engine Rate</span>
            <Sparkles size={20} color="var(--accent-emerald)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', color: '#34d399' }}>{stats.averageMatchScore}%</h3>
          <span style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>Avg Candidate Fit Score</span>
        </div>

      </div>

      {/* Grid: Pending Queue Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        
        {/* Pending Employers Queue */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="var(--accent-amber)" /> Employer Approval Queue ({pendingEmployers.length})
          </h3>

          {pendingEmployers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={36} color="var(--accent-emerald)" style={{ marginBottom: '8px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>All employer accounts verified and approved!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingEmployers.map(emp => (
                <div key={emp.id} style={{ background: 'rgba(15, 22, 36, 0.8)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>{emp.companyName}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contact: {emp.name} ({emp.email})</p>
                    </div>
                    <span className="badge badge-amber">Pending</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
                    Requesting permission to post tech job listings and access AI Applicant Screener.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-accent-danger btn-sm" onClick={() => handleRejectEmployer(emp.id)}>
                      <XCircle size={14} /> Reject
                    </button>
                    <button className="btn btn-accent-success btn-sm" onClick={() => handleApproveEmployer(emp.id)}>
                      <CheckCircle2 size={14} /> Approve Employer
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Job Postings Approval Queue */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="var(--secondary)" /> Job Posting Approval Queue ({pendingJobs.length})
          </h3>

          {pendingJobs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={36} color="var(--accent-emerald)" style={{ marginBottom: '8px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>No pending job postings in approval queue.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingJobs.map(job => (
                <div key={job.id} style={{ background: 'rgba(15, 22, 36, 0.8)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.companyName}</span>
                      <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>{job.title}</h4>
                    </div>
                    <span className="badge badge-cyan">{job.jobType}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px' }}>{job.description}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                    {job.skillsRequired.map(s => (
                      <span key={s} className="badge badge-indigo" style={{ fontSize: '0.72rem', textTransform: 'none' }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-accent-danger btn-sm" onClick={() => handleRejectJob(job.id)}>
                      <XCircle size={14} /> Reject Posting
                    </button>
                    <button className="btn btn-accent-success btn-sm" onClick={() => handleApproveJob(job.id)}>
                      <CheckCircle2 size={14} /> Publish Job Post
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
