import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';
import './ResumePage.css';

export default function ResumeAnalysisPage() {
  const navigate = useNavigate();
  const [parsedResume, setParsedResume] = useState(null);
  const [selectedTech, setSelectedTech] = useState('');
  const [phase, setPhase] = useState('view'); // view | starting

  useEffect(() => {
    const data = sessionStorage.getItem('last_parsed_resume');
    if (!data) {
      navigate('/resume');
      return;
    }
    const resume = JSON.parse(data);
    setParsedResume(resume);

    const allSkills = [
      ...(resume?.resumeAnalysis?.detectedDomains || []),
      ...(resume?.skills?.frameworks || []),
      ...(resume?.skills?.frontend || [])
    ];
    setSelectedTech(allSkills[0] || 'Frontend');
  }, []);

  const startInterview = async () => {
    setPhase('starting');
    try {
      const res = await resumeAPI.startInterview({
        parsedResume,
        technology: selectedTech,
        mode: 'text',
        questions: parsedResume?.interviewQuestions
      });
      sessionStorage.setItem('active_interview', JSON.stringify({ 
        id: res.interviewId, 
        firstMessage: res.firstMessage, 
        questions: res.questions || parsedResume?.interviewQuestions, 
        type: 'resume',
        technology: selectedTech
      }));
      navigate('/resume-interview', { state: { interviewId: res.interviewId, fromResume: true } });
    } catch (err) {
      alert('Failed to initialize session: ' + err.message);
      setPhase('view');
    }
  };

  if (!parsedResume) return null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="resume-analysis-page fade-in">
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.5rem' }}>✨</div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{parsedResume.candidate?.name || 'Professional Profile'}</h2>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {parsedResume.candidate?.email && <span>📧 {parsedResume.candidate.email}</span>}
                {parsedResume.candidate?.linkedin && <a href={parsedResume.candidate.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>LinkedIn</a>}
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/resume')}>Replace File</button>
        </div>

        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
            <h4 className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>ATS Compatibility</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="progress-bar" style={{ flex: 1, height: '10px' }}>
                <div className="progress-fill" style={{ width: `${parsedResume.resumeAnalysis?.atsScore || 0}%` }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>{parsedResume.resumeAnalysis?.atsScore || 0}%</span>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
            <h4 className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>Seniority & Domain</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{parsedResume.resumeAnalysis?.experienceLevel || 'General'}</span>
              {parsedResume.resumeAnalysis?.detectedDomains?.map(d => (
                <span key={d} className="tag tag-purple">{d}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h4 className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Technical Stack Breakdown</h4>
          <div className="grid-3">
            {Object.entries(parsedResume.skills || {}).map(([category, items]) => (
              Array.isArray(items) && items.length > 0 && (
                <div key={category} className="skill-group">
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase' }}>{category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {items.map(s => <span key={s} className="tag" style={{ background: '#FFFFFF', border: '1px solid var(--border-color)' }}>{s}</span>)}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'rgba(79, 70, 229, 0.03)', border: '1px solid rgba(79, 70, 229, 0.1)', padding: '2rem' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>🎯 Ready to interview?</h4>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Focus Skill</label>
              <select 
                className="form-select" 
                value={selectedTech} 
                onChange={e => setSelectedTech(e.target.value)}
              >
                {[
                  ...(parsedResume.skills?.frameworks || []),
                  ...(parsedResume.skills?.frontend || []),
                  ...(parsedResume.resumeAnalysis?.detectedDomains || [])
                ]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ height: '48px', marginTop: '24px', minWidth: '200px' }}
              onClick={startInterview}
              disabled={phase === 'starting'}
            >
              {phase === 'starting' ? 'Initializing...' : `Start Interview →`}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
