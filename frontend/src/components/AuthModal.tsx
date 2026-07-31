import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { mockBackend } from '../services/mockBackend';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState<UserRole>('JobSeeker');
  const [companyName, setCompanyName] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const user = mockBackend.login(loginEmail, loginPassword);
    if (user) {
      onLoginSuccess(user);
      onClose();
    } else {
      setErrorMsg('Invalid login credentials. Please verify your email/username and password.');
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    const user = mockBackend.login(email, pass);
    if (user) {
      onLoginSuccess(user);
      onClose();
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const user = mockBackend.register({
        name,
        email: signupEmail,
        password: signupPassword,
        role,
        companyName: role === 'Employer' ? companyName : undefined
      });
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 8, 15, 0.88)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '480px',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          border: '1px solid var(--border-glow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>
              {mode === 'login' ? 'Account Sign In' : 'Create Account'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <button
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', background: mode === 'login' ? 'var(--primary)' : 'transparent', color: '#fff' }}
            onClick={() => { setMode('login'); setErrorMsg(null); }}
          >
            <LogIn size={14} style={{ marginRight: '6px' }} /> Sign In
          </button>
          <button
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', background: mode === 'signup' ? 'var(--primary)' : 'transparent', color: '#fff' }}
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
          >
            <UserPlus size={14} style={{ marginRight: '6px' }} /> Sign Up
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '16px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Username or Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-field"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. Prakash07 or student@dev.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px', marginBottom: '20px' }}>
              Sign In to Account
            </button>

            {/* Quick Demo Credentials Box */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                ⚡ QUICK PRE-FILLED CREDENTIALS:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Prakash07', '1234')}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between', fontSize: '0.8rem', background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.3)' }}
                >
                  <span>🛡️ Permanent Admin: <strong>Prakash07</strong></span>
                  <span>Pass: 1234</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('student@dev.com', '1234')}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between', fontSize: '0.8rem' }}
                >
                  <span>👨‍🎓 Student: <strong>student@dev.com</strong></span>
                  <span>Pass: 1234</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('employer@nexustech.io', '1234')}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between', fontSize: '0.8rem' }}
                >
                  <span>🏢 Employer: <strong>employer@nexustech.io</strong></span>
                  <span>Pass: 1234</span>
                </button>
              </div>
            </div>

          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label className="input-label">Account Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRole('JobSeeker')}
                  className={`btn btn-sm ${role === 'JobSeeker' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '10px', fontSize: '0.85rem' }}
                >
                  👨‍🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Employer')}
                  className={`btn btn-sm ${role === 'Employer' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '10px', fontSize: '0.85rem' }}
                >
                  🏢 Employer
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address / Username</label>
              <input
                type="text"
                className="input-field"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="e.g. student@dev.com"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Create Password</label>
              <input
                type="password"
                className="input-field"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {role === 'Employer' && (
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Nexus Tech Solutions"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
              Create {role === 'JobSeeker' ? 'Student' : 'Employer'} Account
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
