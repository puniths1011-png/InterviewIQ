import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { interviewsAPI } from '../services/api';
import './AIInterviewPage.css';

const TECHNOLOGIES = [
  "React & Frontend", "Node.js & Backend", "Full Stack MERN", "TypeScript",
  "MongoDB & Database", "JavaScript", "Docker & DevOps",
  "GraphQL", "REST APIs", "Data Science", "Data Analytics",
  "Artificial Intelligence (AI)", "Machine Learning", "Generative AI (Gen AI)"
];

const LEVELS = [
  { value: 'Junior', label: 'Junior', sub: '0–2 years' },
  { value: 'Mid-Level', label: 'Mid-Level', sub: '2–5 years' },
  { value: 'Senior', label: 'Senior', sub: '5–8 years' },
  { value: 'Expert', label: 'Expert', sub: '8+ years' }
];

export default function AIInterviewSetupPage() {
  const navigate = useNavigate();
  const [tech, setTech] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!tech || !level) {
      setError('Please select both technology and experience level.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await interviewsAPI.start({ technology: tech, experienceLevel: level, mode: 'text' });
      sessionStorage.setItem('active_interview', JSON.stringify({ 
        id: res.interviewId, 
        firstMessage: res.firstMessage, 
        questions: res.questions, 
        type: 'general',
        technology: tech
      }));
      navigate(`/interview/session/${res.interviewId}`);
    } catch (err) {
      setError(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="interview-setup-page fade-in">
      <div className="card" style={{ maxWidth: '680px', margin: '2rem auto', padding: '3rem 2.5rem', textAlign: 'center' }}>
        <motion.div variants={item} style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🤖</motion.div>
        <motion.h2 variants={item} style={{ fontSize: '2rem', marginBottom: '1rem' }}>AI Mock Interview</motion.h2>
        <motion.p variants={item} style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Configure your session and practice with our advanced AI interviewer.
        </motion.p>

        {error && <motion.div variants={item} className="error-banner">{error}</motion.div>}

        <div style={{ display: 'grid', gap: '2rem', textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
          <motion.div variants={item} className="form-group">
            <label className="form-label">Target Technology</label>
            <select className="form-select" value={tech} onChange={e => setTech(e.target.value)}>
              <option value="">Choose a skill...</option>
              {TECHNOLOGIES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </motion.div>

          <motion.div variants={item} className="form-group">
            <label className="form-label">Experience Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {LEVELS.map(l => (
                <div 
                  key={l.value} 
                  className={`card ${level === l.value ? 'active' : ''}`}
                  style={{ 
                    padding: '1rem', 
                    cursor: 'pointer', 
                    textAlign: 'center',
                    borderColor: level === l.value ? 'var(--primary)' : 'var(--border-color)',
                    background: level === l.value ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
                  }}
                  onClick={() => setLevel(l.value)}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: level === l.value ? 'var(--primary)' : 'var(--text-primary)' }}>{l.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{l.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.button 
            variants={item}
            className="btn btn-primary btn-lg" 
            style={{ marginTop: '1rem', height: '56px' }}
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? 'Initializing Session...' : '🚀 Start AI Interview'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
