import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { questionsAPI } from '../services/api';
import { mockMCQ } from '../services/MockService';
import './MCQPage.css';

export default function MCQQuizPage() {
  const { technology } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { tech, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answered, setAnswered] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(90);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (!technology) {
      navigate('/mcq');
      return;
    }
    loadQuiz();
  }, [technology]);

  useEffect(() => {
    if (loading || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleNext(); return 90; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, currentIdx, questions.length]);

  const loadQuiz = async () => {
    setLoading(true);
    console.log("Loading quiz for:", technology);
    try {
      // First check mock data for specific technologies
      const mockQuestions = mockMCQ.getQuiz(technology);
      console.log("Mock questions found:", !!mockQuestions);
      let rawData = [];
      if (mockQuestions) {
        rawData = mockQuestions;
      } else {
        const res = await questionsAPI.getQuiz(technology, { count: 10, difficulty });
        console.log("API response:", res);
        rawData = res.questions || res.data || (Array.isArray(res) ? res : []);
      }
      
      if (!rawData || rawData.length === 0) {
        alert('No questions found. Returning to selector.');
        navigate('/mcq');
        return;
      }

      // Shuffle options for each question
      const shuffledQuestions = rawData.map(q => {
          const options = q.options.map((opt, i) => ({ ...opt, originalIndex: i }));
          for (let i = options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [options[i], options[j]] = [options[j], options[i]];
          }
          const newCorrectIndex = options.findIndex(opt => opt.originalIndex === q.correctOptionIndex);
          return { ...q, options, correctOptionIndex: newCorrectIndex };
      });

      setQuestions(shuffledQuestions);
    } catch (err) {
      console.error('Quiz load error:', err);
      // navigate('/mcq'); // Commented out to debug
    } finally {
      setLoading(false);
    }
  };

  const submitOption = async (optIdx) => {
    if (answered[currentIdx]) return;
    setSelectedOpt(optIdx);

    try {
      const q = questions[currentIdx];
      
      // If it's a mock question, evaluate locally
      if (q._id.startsWith('ml_') || q._id.startsWith('sql_') || q._id.startsWith('react_') || q._id.startsWith('node_') || q._id.startsWith('mongo_') || q._id.startsWith('ts_') || q._id.startsWith('js_') || q._id.startsWith('css_') || q._id.startsWith('next_') || q._id.startsWith('py_') || q._id.startsWith('java_') || q._id.startsWith('docker_') || q._id.startsWith('k8s_') || q._id.startsWith('gql_') || q._id.startsWith('rest_') || q._id.startsWith('pg_')) {
        const isCorrect = optIdx === q.correctOptionIndex;
        const answerData = {
          selected: optIdx,
          correct: isCorrect,
          correctIdx: q.correctOptionIndex,
          explanation: q.explanation,
          points: 10
        };
        setAnswered(prev => ({ ...prev, [currentIdx]: answerData }));
        if (isCorrect) setTotalScore(s => s + 10);
        return;
      }

      const res = await questionsAPI.submitAnswer(q._id, {
        selectedOptionIndex: optIdx,
        timeSpent: 90 - timeLeft
      });

      const answerData = {
        selected: optIdx,
        correct: res.isCorrect,
        correctIdx: res.correctOptionIndex,
        explanation: res.explanation,
        points: res.points
      };

      setAnswered(prev => ({ ...prev, [currentIdx]: answerData }));
      if (res.isCorrect) setTotalScore(s => s + (res.points || 10));
    } catch (err) {
      setAnswered(prev => ({ ...prev, [currentIdx]: { selected: optIdx, correct: false, correctIdx: 0, explanation: '', points: 0 } }));
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setTimeLeft(90);
    } else {
      // Calculate score from answered answers to avoid stale state
      const finalScore = Object.values(answered).reduce((acc, a) => acc + (a.correct ? (a.points || 10) : 0), 0);
      
      // Store results in session storage to pass to results page
      sessionStorage.setItem('last_quiz_result', JSON.stringify({
        tech: tech || { name: technology, emoji: '🧩' },
        questions,
        answered,
        totalScore: finalScore
      }));
      navigate('/mcq/results');
    }
  };

  const handlePrev = () => {
    setSelectedOpt(null);
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  if (loading) return (
    <div className="app-loader">
      <div className="loader-ring" />
      <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Preparing your assessment...</p>
    </div>
  );

  const q = questions[currentIdx];
  const ans = answered[currentIdx];
  const progressPct = ((currentIdx + 1) / questions.length) * 100;
  const timerColor = timeLeft <= 20 ? '#EF4444' : timeLeft <= 45 ? '#F59E0B' : '#10B981';

  return (
    <div className="mcq-quiz fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="quiz-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/mcq')}>← Exit</button>
        <div className="quiz-info" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>{tech?.emoji || '🧩'} {technology} Quiz</h3>
          <span className="mono" style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Question {currentIdx + 1} of {questions.length}</span>
        </div>
        <div className="quiz-timer mono" style={{ 
          color: timerColor, 
          padding: '4px 12px', 
          border: `1px solid ${timerColor}`, 
          borderRadius: '8px',
          minWidth: '70px',
          textAlign: 'center'
        }}>
          {String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}
        </div>
      </div>

      <div className="progress-bar" style={{ marginBottom: '2rem' }}>
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {q && (
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="quiz-body"
        >
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              <span className="tag tag-purple">{technology}</span>
              <span className="tag tag-green">{q.difficulty}</span>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{q.question}</p>
            {q.codeSnippet && (
              <pre style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                marginTop: '1.5rem',
                overflowX: 'auto',
                fontSize: '13px'
              }} className="mono">
                {q.codeSnippet}
              </pre>
            )}
          </div>

          <div className="options-list" style={{ display: 'grid', gap: '1rem' }}>
            {q.options?.map((opt, i) => {
              let style = {};
              if (ans) {
                if (i === ans.correctIdx) style = { background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' };
                else if (i === ans.selected && !ans.correct) style = { background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' };
              } else if (selectedOpt === i) {
                style = { borderColor: 'var(--primary)', background: 'var(--hover-bg)' };
              }
              
              return (
                <div 
                  key={i} 
                  className="option-item card" 
                  style={{ 
                    padding: '1rem 1.25rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    ...style
                  }} 
                  onClick={() => submitOption(i)}
                >
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '6px', 
                    background: 'var(--bg-secondary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    flexShrink: 0
                  }} className="mono">
                    {['A','B','C','D'][i]}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.95rem' }}>{opt.text}</div>
                  {ans && i === ans.correctIdx && <span style={{ color: '#10B981' }}>✓</span>}
                  {ans && i === ans.selected && !ans.correct && <span style={{ color: '#EF4444' }}>✗</span>}
                </div>
              );
            })}
          </div>

          {ans?.explanation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                marginTop: '2rem', 
                padding: '1.5rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: '12px',
                borderLeft: '4px solid var(--primary)'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>💡 Explanation</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{ans.explanation}</p>
            </motion.div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIdx === 0}>← Previous</button>
            <div style={{ display: 'flex', gap: 6 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: i === currentIdx ? 'var(--primary)' : answered[i] ? (answered[i].correct ? '#10B981' : '#EF4444') : 'var(--border-color)'
                }} />
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleNext} disabled={!answered[currentIdx]}>
              {currentIdx === questions.length - 1 ? 'Finish Assessment' : 'Next Question →'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
