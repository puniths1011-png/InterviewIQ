import React, { useState } from 'react';
import { interviewsAPI } from '../services/api';
import './AIInterviewPage.css';

const TECH_STACKS = [
  "React & Frontend", "Node.js & Backend", "Full Stack MERN", "TypeScript",
  "MongoDB & Database", "JavaScript", "Docker & DevOps",
  "GraphQL", "REST APIs", "Data Science", "Data Analytics",
  "Artificial Intelligence (AI)", "Machine Learning", "Generative AI (Gen AI)"
];

const EXPERIENCE_LEVELS = ["Junior", "Mid-Level", "Senior", "Expert"];

export default function AIQuestionGenerator() {
  const [tech, setTech] = useState('');
  const [level, setLevel] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!tech || !level) {
      setError('Please select both technology and experience level.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // The new endpoint expects the exact values from the list
      const result = await interviewsAPI.generateQuestions({ 
        technology: tech, 
        experienceLevel: level 
      });
      
      if (result.success) {
        setQuestions(result.data.questions || []);
      } else {
        throw new Error(result.message || 'Failed to generate questions');
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
      setError(error.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-setup fade-in">
      <div className="setup-card" style={{ maxWidth: '800px' }}>
        <div className="setup-icon">💡</div>
        <h2 className="setup-title">AI Question Generator</h2>
        <p className="setup-desc">
          Generate 10 professional interview questions for any technology and level.
        </p>

        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label className="form-label">Technology</label>
          <select 
            className="form-select" 
            value={tech} 
            onChange={(e) => setTech(e.target.value)}
          >
            <option value="">Choose Technology...</option>
            {TECH_STACKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Experience Level</label>
          <select 
            className="form-select" 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Choose Level...</option>
            {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <button 
          className="btn btn-primary btn-lg" 
          style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
          onClick={handleGenerate} 
          disabled={loading || !tech || !level}
        >
          {loading ? <><div className="btn-spinner" />Generating Questions...</> : '🚀 Generate 10 Questions'}
        </button>

        {questions.length > 0 && (
          <div className="questions-list" style={{ marginTop: 32, textAlign: 'left' }}>
            <h3 style={{ marginBottom: 20, fontSize: 18, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              Generated Questions
            </h3>
            <div style={{ display: 'grid', gap: 16 }}>
              {questions.map((q, idx) => (
                <div key={idx} className="card" style={{ padding: 20, borderLeft: '4px solid var(--accent3)', background: 'var(--bg2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: 14, color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Question {idx + 1}
                    </h4>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="tag tag-purple" style={{ fontSize: 10 }}>{q.difficulty}</span>
                      <span className="tag tag-blue" style={{ fontSize: 10 }}>{q.type}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--text1)', lineHeight: 1.6, margin: 0 }}>{q.question}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
