import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MCQPage.css';

export default function MCQResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('last_quiz_result');
    if (!data) {
      navigate('/mcq');
      return;
    }
    setResult(JSON.parse(data));
  }, []);

  if (!result) return null;

  const { tech, questions, answered, totalScore } = result;
  const correctCount = Object.values(answered).filter(a => a.correct).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="mcq-result fade-in" 
      style={{ maxWidth: '900px', margin: '0 auto' }}
    >
      <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 2rem' }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--bg-secondary)" strokeWidth="12" />
            <motion.circle 
              cx="80" cy="80" r="70" fill="none"
              stroke={percentage >= 70 ? '#10B981' : percentage >= 50 ? 'var(--primary)' : '#EF4444'}
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - percentage / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
            />
          </svg>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{percentage}%</div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>score</div>
          </div>
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{tech.emoji} {tech.name} Assessment</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
          You correctly answered <strong>{correctCount} out of {questions.length}</strong> questions.
          <br />
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Total Points Earned: {totalScore} XP</span>
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/mcq')}>← Back to Topics</button>
          <button className="btn btn-primary" onClick={() => navigate(`/mcq/quiz/${tech.name}`, { state: { tech } })}>🔄 Retake Quiz</button>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>Detailed Review</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {questions.map((q, i) => {
          const a = answered[i];
          return (
            <motion.div key={i} variants={item} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span className="mono" style={{ 
                    fontSize: '12px', 
                    background: 'var(--bg-secondary)', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    color: 'var(--text-dim)' 
                  }}>Q{i+1}</span>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: a?.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: a?.correct ? '#10B981' : '#EF4444',
                    fontSize: '12px'
                  }}>
                    {a?.correct ? '✓' : '✗'}
                  </div>
                </div>
                <span className="tag" style={{ fontSize: '10px' }}>{q.difficulty}</span>
              </div>
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{q.question}</p>
              
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {q.options.map((opt, idx) => (
                  <div key={idx} style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem',
                    background: idx === a?.correctIdx ? 'rgba(16, 185, 129, 0.05)' : idx === a?.selected && !a?.correct ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                    border: '1px solid',
                    borderColor: idx === a?.correctIdx ? '#10B981' : idx === a?.selected && !a?.correct ? '#EF4444' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{opt.text}</span>
                    {idx === a?.correctIdx && <span style={{ color: '#10B981', fontWeight: 700 }}>Correct</span>}
                    {idx === a?.selected && !a?.correct && <span style={{ color: '#EF4444', fontWeight: 700 }}>Your Answer</span>}
                  </div>
                ))}
              </div>

              {a?.explanation && (
                <div style={{ 
                  marginTop: '1.25rem', 
                  padding: '1rem', 
                  fontSize: '0.85rem', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '8px',
                  color: 'var(--text-secondary)'
                }}>
                  <strong>Explanation:</strong> {a.explanation}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
