import React from 'react';
import { User } from '../types';
import { Sparkles, ShieldCheck, Briefcase, UserCheck, Search, FileText, LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenResumeModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  pendingJobsCount: number;
  pendingEmployersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenResumeModal,
  onOpenAuthModal,
  onLogout,
  pendingJobsCount,
  pendingEmployersCount
}) => {
  const totalPendingAdmin = pendingJobsCount + pendingEmployersCount;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--primary-glow)' }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              TalentPulse <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--primary-glow)', color: '#a5b4fc', border: '1px solid var(--border-glow)' }}>AI</span>
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Smart Job Matching Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px 6px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'explore' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
            onClick={() => setActiveTab('explore')}
          >
            <Search size={16} /> Explore Jobs
          </button>

          {currentUser?.role === 'JobSeeker' && (
            <button
              className={`btn btn-sm ${activeTab === 'seeker-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
              onClick={() => setActiveTab('seeker-dashboard')}
            >
              <UserCheck size={16} /> My Dashboard
            </button>
          )}

          {currentUser?.role === 'Employer' && (
            <button
              className={`btn btn-sm ${activeTab === 'employer-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
              onClick={() => setActiveTab('employer-dashboard')}
            >
              <Briefcase size={16} /> Employer Portal
            </button>
          )}

          {currentUser?.role === 'Admin' && (
            <button
              className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', position: 'relative' }}
              onClick={() => setActiveTab('admin-dashboard')}
            >
              <ShieldCheck size={16} /> Admin Suite
              {totalPendingAdmin > 0 && (
                <span className="badge badge-rose" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                  {totalPendingAdmin}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Action Controls & Header Account Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {currentUser?.role === 'JobSeeker' && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenResumeModal}>
              <FileText size={15} color="#06b6d4" /> Upload Resume
            </button>
          )}

          {currentUser ? (
            /* Logged In User State */
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', color: '#fff' }}>{currentUser.name}</span>
                  <span className="badge badge-indigo" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
                    {currentUser.role === 'JobSeeker' ? 'Student' : currentUser.role}
                  </span>
                </div>
              </div>

              <button className="btn btn-accent-danger btn-sm" onClick={onLogout} title="Sign Out of session">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            /* Logged Out / Guest State */
            <button className="btn btn-primary btn-sm" onClick={onOpenAuthModal}>
              <LogIn size={15} /> Sign In / Sign Up
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
