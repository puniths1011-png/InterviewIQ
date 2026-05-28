import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewsAPI } from '../services/api';
import './AIInterviewPage.css'; // Reuse chat styles

export default function ResumeInterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('active'); // Directly start active if coming from ResumePage
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [qProgress, setQProgress] = useState(Array(10).fill('pending'));
  const [finalReport, setFinalReport] = useState(null);
  const [error, setError] = useState('');
  const [config, setConfig] = useState({ technology: '', mode: 'text' });

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const startTime = useRef(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem('active_interview');
    if (sessionData) {
      const { id, firstMessage, questions: qList, technology } = JSON.parse(sessionData);
      setInterviewId(id);
      setQuestions(qList);
      setMessages([{ role: 'ai', text: firstMessage, time: new Date() }]);
      setConfig(prev => ({ ...prev, technology }));
      
      const progress = Array(10).fill('pending');
      progress[0] = 'current';
      setQProgress(progress);
      startTime.current = Date.now();
    } else {
      navigate('/resume'); // Redirect back if no session
    }
  }, [navigate]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendAnswer = async () => {
    const answer = input.trim();
    if (!answer || loading) return;

    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    startTime.current = Date.now();

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: answer, time: new Date() }]);
    setLoading(true);
    setMessages(prev => [...prev, { role: 'ai', text: '...typing', isTyping: true }]);

    try {
      const res = await interviewsAPI.submitAnswer(interviewId, {
        answer,
        questionIndex: currentQ,
        timeSpent
      });

      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { role: 'ai', text: res.aiResponse, time: new Date(), analysis: res.analysis }];
      });

      const newProgress = [...qProgress];
      newProgress[currentQ] = 'done';
      if (!res.isLast) newProgress[currentQ + 1] = 'current';
      setQProgress(newProgress);

      if (res.isLast) {
        const report = await interviewsAPI.complete(interviewId);
        setFinalReport(report.report);
        setPhase('complete');
      } else {
        setCurrentQ(res.nextQuestion.index);
      }
    } catch (err) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { role: 'ai', text: 'Sorry, I had trouble processing that. Please try again.', time: new Date() }];
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const skipQuestion = async () => {
    if (loading || phase === 'complete') return;
    
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: '[Skipped Question]', time: new Date() }]);
    setMessages(prev => [...prev, { role: 'ai', text: '...skipping', isTyping: true }]);

    try {
      const res = await interviewsAPI.submitAnswer(interviewId, {
        answer: "I'd like to skip this question.",
        questionIndex: currentQ,
        timeSpent: 0
      });

      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { role: 'ai', text: res.aiResponse, time: new Date(), analysis: { score: 0 } }];
      });

      const newProgress = [...qProgress];
      newProgress[currentQ] = 'done';
      if (!res.isLast) newProgress[currentQ + 1] = 'current';
      setQProgress(newProgress);

      if (res.isLast) {
        const report = await interviewsAPI.complete(interviewId);
        setFinalReport(report.report);
        setPhase('complete');
      } else {
        setCurrentQ(res.nextQuestion.index);
      }
    } catch (err) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { role: 'ai', text: 'Error skipping question. Please try again.', time: new Date() }];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer(); }
  };

  const getQTypeLabel = (index) => {
    if (index < 5) return 'Project Related';
    if (index < 8) return 'Technical Skill';
    return 'HR / Behavioral';
  };

  if (phase === 'complete') return (
    <div className="interview-complete fade-in">
      <div className="complete-header">
        <div className="complete-icon">🎯</div>
        <h2>Resume Interview Complete!</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Specialized assessment finished</p>
      </div>
      {finalReport && (
        <div className="report-grid">
           <div className="card" style={{ textAlign: 'center' }}>
            <div className="report-score">{finalReport.metrics ? Math.round(Object.values(finalReport.metrics).reduce((a,b)=>a+b,0)/5) : 80}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>RESUME MATCH SCORE</div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="section-title">Resume-Based Evaluation</div>
            <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>{finalReport.overallSummary}</p>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/resume')}>Back to Upload</button>
        <a href="/feedback" className="btn btn-primary btn-lg">View Detailed Feedback →</a>
      </div>
    </div>
  );

  return (
    <div className="interview-chat fade-in">
      <div className="chat-header-bar">
        <div className="ai-avatar-ring">📄</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Alex — Resume Interviewer</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--secondary)' }}>
            <span className="online-dot" style={{ backgroundColor: 'var(--secondary)' }} />
            Analyzing Background · {config.technology}
          </div>
        </div>
        <div className="q-type-badge mono">{getQTypeLabel(currentQ)}</div>
        <div className="q-progress-label mono">Q {currentQ + 1}/10</div>
      </div>

      <div className="q-dots-track">
        {qProgress.map((status, i) => (
          <div key={i} className={`q-dot q-dot-${status}`} title={`Question ${i+1}`} />
        ))}
      </div>

      <div className="chat-body" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            {msg.role === 'ai' && <div className="msg-avatar">📄</div>}
            <div className="msg-content">
              {msg.isTyping
                ? <div className="chat-bubble ai-bubble"><div className="typing"><span/><span/><span/></div></div>
                : <div className={`chat-bubble ${msg.role === 'ai' ? 'ai-bubble' : 'user-bubble'}`}>{msg.text}</div>
              }
              {msg.analysis && (
                <div className="inline-score">
                  Accuracy: <strong style={{ color: 'var(--secondary)' }}>{msg.analysis.score}%</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-textarea"
            placeholder="Describe your experience..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
            rows={2}
          />
        </div>
        <div className="chat-actions">
          <button className="btn btn-ghost btn-sm" onClick={skipQuestion} disabled={loading}>
            ⏩ Skip Question
          </button>
          <button className="btn btn-primary" onClick={sendAnswer} disabled={loading || !input.trim()}>
            {loading ? <div className="btn-spinner" /> : '↑ Send Answer'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/resume')}>Quit</button>
        </div>
      </div>
    </div>
  );
}
