import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewsAPI } from '../services/api';
import './AIInterviewPage.css';

export default function AIInterviewSessionPage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const scrollRef = useRef();

  useEffect(() => {
    const active = sessionStorage.getItem('active_interview');
    if (!active) {
      navigate('/interview');
      return;
    }

    const data = JSON.parse(active);
    if (data.id !== interviewId) {
      navigate('/interview');
      return;
    }

    setMessages([{ role: 'ai', content: data.firstMessage }]);
    // If questions are provided, we can track index. If not, we start at 0.
    setCurrentQuestionIndex(0);
  }, [interviewId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await interviewsAPI.submitAnswer(interviewId, { 
        answer: userMsg,
        questionIndex: currentQuestionIndex 
      });
      
      if (res.isCompleted) {
        setIsCompleted(true);
        setFinalReport(res.report);
      } else {
        const nextContent = typeof res.nextQuestion === 'object' ? res.nextQuestion.question : res.nextQuestion;
        setMessages(prev => [...prev, { role: 'ai', content: nextContent, analysis: res.analysis }]);
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error processing that. Could you please repeat your answer?" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (loading || isCompleted) return;
    
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: "[Skipped Question]" }]);

    try {
      const res = await interviewsAPI.submitAnswer(interviewId, { 
        answer: "I'm not sure about this one, please move to the next question.",
        questionIndex: currentQuestionIndex
      });
      
      if (res.isCompleted) {
        setIsCompleted(true);
        setFinalReport(res.report);
      } else {
        const nextContent = typeof res.nextQuestion === 'object' ? res.nextQuestion.question : res.nextQuestion;
        setMessages(prev => [...prev, { role: 'ai', content: nextContent, analysis: { score: 0, feedback: "Question skipped." } }]);
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error('Skip answer error:', err);
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered an error. Let's try skipping again or proceed." }]);
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted && finalReport) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="interview-complete fade-in">
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Interview Completed!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>You've successfully finished your mock interview session.</p>
          </div>

          <div className="grid-2" style={{ marginBottom: '3rem' }}>
            <div className="card" style={{ background: 'var(--bg-secondary)', textAlign: 'center', border: 'none' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {finalReport.overallScore || 85}%
              </div>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Overall Score</div>
            </div>
            <div className="card" style={{ background: 'var(--bg-secondary)', textAlign: 'center', border: 'none' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{finalReport.rank || 'Strong'} Candidate</div>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Performance Level</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            <button className="btn btn-primary" onClick={() => navigate(`/feedback/${interviewId}`)}>View Detailed Feedback</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="interview-session" style={{ maxWidth: '850px', margin: '1rem auto', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <div className="chat-container card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div className="chat-header" style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Live AI Interview Session</span>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }} onClick={() => navigate('/interview')}>End Session</button>
        </div>

        <div className="messages-area" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                  display: 'flex', 
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '1.5rem'
                }}
              >
                <div className={`message-bubble ${m.role}`} style={{ 
                  maxWidth: '80%', 
                  padding: '1.25rem 1.5rem', 
                  borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: m.role === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: m.role === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6
                }}>
                  {m.content}
                  {m.analysis && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.8rem', opacity: 0.8 }}>
                      <strong>AI Analysis:</strong> Accuracy: {m.analysis.score}%
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', marginBottom: '1.5rem' }}>
                <div className="message-bubble ai" style={{ padding: '1rem 1.5rem', borderRadius: '18px 18px 18px 2px', background: 'var(--bg-secondary)' }}>
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </AnimatePresence>
        </div>

        <div className="chat-input-area" style={{ padding: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              className="btn btn-ghost" 
              style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}
              onClick={handleSkip}
              disabled={loading}
            >
              Skip Question
            </button>
            <textarea 
              className="form-input" 
              placeholder="Type your response here..." 
              style={{ flex: 1, resize: 'none', height: '56px', borderRadius: '12px' }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              disabled={loading}
            />
            <button 
              className="btn btn-primary" 
              style={{ width: '56px', height: '56px', borderRadius: '12px', padding: 0 }}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
