import React, { useState } from 'react';
import { JobSeekerProfile } from '../types';
import { X, FileText, Sparkles, CheckCircle2, UploadCloud, Plus } from 'lucide-react';
import { extractSkillsFromText } from '../services/nlpEngine';

interface ResumeUploadModalProps {
  profile: JobSeekerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: JobSeekerProfile) => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile
}) => {
  const [headline, setHeadline] = useState(profile.headline);
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears);
  const [resumeText, setResumeText] = useState(profile.resumeText || '');
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [newSkill, setNewSkill] = useState('');
  const [extractedSkillsPreview, setExtractedSkillsPreview] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setResumeText(text);
    const parsed = extractSkillsFromText(text);
    setExtractedSkillsPreview(parsed);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleApplyExtractedSkills = () => {
    const combined = Array.from(new Set([...skills, ...extractedSkillsPreview]));
    setSkills(combined);
    setExtractedSkillsPreview([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      headline,
      experienceYears: Number(experienceYears),
      skills,
      resumeText,
      resumeFileName: profile.resumeFileName || 'Uploaded_Resume.pdf'
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
          maxWidth: '740px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          border: '1px solid var(--border-glow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color="#06b6d4" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>AI Resume & Skill Profiler</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Paste or upload resume to parse technical skills automatically</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Headline */}
          <div className="input-group">
            <label className="input-label">Professional Headline</label>
            <input
              type="text"
              className="input-field"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer (React & C# .NET Core)"
              required
            />
          </div>

          {/* Years of Experience */}
          <div className="input-group">
            <label className="input-label">Years of Relevant Experience</label>
            <input
              type="number"
              className="input-field"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              min={0}
              max={30}
              required
            />
          </div>

          {/* Resume Text Content Parser */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="input-label">Resume Text & Skills Content</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={13} /> Live NLP Skill Parsing Enabled
              </span>
            </div>
            <textarea
              className="input-field"
              rows={6}
              value={resumeText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste raw resume text, project summaries, or technical skill descriptions..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Extracted Skills Preview notification */}
          {extractedSkillsPreview.length > 0 && (
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#67e8f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} /> NLP Detected {extractedSkillsPreview.length} New Technical Skills:
                </span>
                <button
                  type="button"
                  onClick={handleApplyExtractedSkills}
                  className="btn btn-secondary btn-sm"
                  style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', border: '1px solid rgba(6, 182, 212, 0.4)' }}
                >
                  <CheckCircle2 size={13} /> Auto-Add to Profile
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {extractedSkillsPreview.map(s => (
                  <span key={s} className="badge badge-cyan" style={{ textTransform: 'none' }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Current Profile Skills Tags */}
          <div style={{ marginBottom: '24px' }}>
            <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Verified Profile Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {skills.map(s => (
                <span
                  key={s}
                  className="badge badge-indigo"
                  style={{ fontSize: '0.82rem', padding: '4px 10px', textTransform: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Add skill (e.g. C#, SQL Server, Docker)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>
                <Plus size={16} /> Add Skill
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <UploadCloud size={16} /> Save Profile & Resume AI
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
