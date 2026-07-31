import React, { useState } from 'react';
import { Job, JobType } from '../types';
import { X, Briefcase, Plus, Sparkles } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'status'>) => void;
  companyName: string;
  employerId: string;
}

const COMMON_TECH = ['React', 'TypeScript', 'C#', '.NET Core', 'ASP.NET', 'SQL Server', 'REST API', 'Node.js', 'Python', 'Docker', 'Azure', 'AWS', 'Git', 'Tailwind', 'GraphQL', 'NLP'];

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onSubmitJob,
  companyName,
  employerId
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [location, setLocation] = useState('Remote');
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [salaryRange, setSalaryRange] = useState('$100,000 - $130,000 / year');
  const [skillsRequired, setSkillsRequired] = useState<string[]>(['React', 'C#', 'SQL Server']);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (skillsRequired.includes(skill)) {
      setSkillsRequired(skillsRequired.filter(s => s !== skill));
    } else {
      setSkillsRequired([...skillsRequired, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reqArray = requirementsText
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    onSubmitJob({
      employerId,
      companyName,
      title,
      department,
      description,
      requirements: reqArray.length > 0 ? reqArray : ['Relevant experience required'],
      skillsRequired,
      location,
      jobType,
      salaryRange
    });

    onClose();
  };

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
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          border: '1px solid var(--border-glow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={22} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Create Job Opportunity</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Posted under {companyName} • Requires Admin Approval</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Job Title</label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Department</label>
              <input
                type="text"
                className="input-field"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Product Engineering"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Location</label>
              <input
                type="text"
                className="input-field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote / New York"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Employment Type</label>
              <select className="input-field" value={jobType} onChange={(e) => setJobType(e.target.value as JobType)}>
                <option value="Full-time" style={{ background: '#121826' }}>Full-time</option>
                <option value="Remote" style={{ background: '#121826' }}>Remote</option>
                <option value="Contract" style={{ background: '#121826' }}>Contract</option>
                <option value="Hybrid" style={{ background: '#121826' }}>Hybrid</option>
                <option value="Part-time" style={{ background: '#121826' }}>Part-time</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Salary Compensation</label>
              <input
                type="text"
                className="input-field"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $110k - $140k"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Job Summary & Role Description</label>
            <textarea
              className="input-field"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe candidate expectations, tech stack responsibilities, and team impact..."
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Key Requirements & Qualifications (1 per line)</label>
            <textarea
              className="input-field"
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder={`5+ years experience with React and TypeScript\nStrong proficiency in C# ASP.NET Core\nExperience with SQL Server query tuning`}
            />
          </div>

          {/* Tech Skill Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label className="input-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--primary)" /> Required AI Match Skills Tagging
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {COMMON_TECH.map(skill => {
                const isSelected = skillsRequired.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`badge ${isSelected ? 'badge-indigo' : 'badge-cyan'}`}
                    style={{
                      cursor: 'pointer',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-glass)'
                    }}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Submit Job for Admin Approval
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
