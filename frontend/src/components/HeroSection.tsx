import React from 'react';
import { Search, MapPin, Briefcase, Cpu, CheckCircle2, Zap } from 'lucide-react';

interface HeroSectionProps {
  keyword: string;
  setKeyword: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  jobType: string;
  setJobType: (val: string) => void;
  onSearch: () => void;
  selectedSkills: string[];
  onToggleSkillTag: (skill: string) => void;
}

const FEATURED_TAGS = ['React', 'C#', 'ASP.NET Core', 'SQL Server', 'TypeScript', 'NLP', 'REST API', 'Docker'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  keyword,
  setKeyword,
  location,
  setLocation,
  jobType,
  setJobType,
  onSearch,
  selectedSkills,
  onToggleSkillTag
}) => {
  return (
    <section style={{ padding: '60px 24px 40px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* Badge Pill */}
      <div className="badge badge-indigo animate-fade-in" style={{ padding: '6px 16px', fontSize: '0.85rem', marginBottom: '20px' }}>
        <Cpu size={16} /> Intelligent AI-Powered NLP Job Matching & Screener
      </div>

      {/* Main Title */}
      <h1 className="animate-fade-in" style={{ fontSize: '3.2rem', lineHeight: '1.25', marginBottom: '16px', maxWidth: '900px', margin: '0 auto 16px' }}>
        Discover Your Next Role with{' '}
        <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Precision AI Matching
        </span>
      </h1>

      <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 36px' }}>
        Our natural language processing algorithms parse candidate resumes and job requirements in real-time to compute instant skill gap diagnostics and fit scores.
      </p>

      {/* Search Container */}
      <div className="glass-panel" style={{ maxWidth: '960px', margin: '0 auto 30px', padding: '16px', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
          
          {/* Keyword Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 22, 36, 0.9)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <Search size={18} color="var(--primary)" />
            <input
              type="text"
              placeholder="Job title, keywords, or skills..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            />
          </div>

          {/* Location Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 22, 36, 0.9)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <MapPin size={18} color="var(--secondary)" />
            <input
              type="text"
              placeholder="Location or 'Remote'"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            />
          </div>

          {/* Job Type Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 22, 36, 0.9)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <Briefcase size={18} color="var(--accent-purple)" />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.95rem', cursor: 'pointer' }}
            >
              <option value="All" style={{ background: '#121826' }}>All Types</option>
              <option value="Full-time" style={{ background: '#121826' }}>Full-time</option>
              <option value="Remote" style={{ background: '#121826' }}>Remote</option>
              <option value="Contract" style={{ background: '#121826' }}>Contract</option>
              <option value="Hybrid" style={{ background: '#121826' }}>Hybrid</option>
            </select>
          </div>

          {/* Search Button */}
          <button className="btn btn-primary" onClick={onSearch} style={{ padding: '14px 28px', height: '100%' }}>
            <Zap size={18} /> Search Jobs
          </button>

        </div>

        {/* Skill Tag Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Popular Tech Skills:</span>
          {FEATURED_TAGS.map(skill => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => onToggleSkillTag(skill)}
                className={`badge ${isSelected ? 'badge-indigo' : 'badge-cyan'}`}
                style={{ cursor: 'pointer', border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', textTransform: 'none', fontSize: '0.8rem' }}
              >
                {isSelected && <CheckCircle2 size={12} />} {skill}
              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
};
