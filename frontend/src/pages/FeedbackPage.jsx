import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { feedbackAPI } from '../services/api';
import './FeedbackPage.css';

export default function FeedbackPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = id
      ? feedbackAPI.getById(id)
      : feedbackAPI.getLatest();

    fetch
      .then(r => setInterview(r.data))
      .catch(err => setError(err.message || 'No feedback found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div className="loader-ring" />
    </div>
  );

  if (error || !interview) return (
    <div className="feedback-empty fade-in">
      <div className="empty-icon">📭</div>
      <h3>No feedback yet</h3>
      <p>Complete an AI mock interview to see your detailed performance report.</p>
      <Link to="/interview" className="btn btn-primary">Start an Interview →</Link>
    </div>
  );

  const metrics = interview.analytics?.metrics || {};
  const score = interview.analytics?.overallScore || 0;
  const answers = interview.answers || [];
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - score / 100);

  const gradeColor = (g) => {
    if (g === 'Excellent') return 'var(--accent3)';
    if (g === 'Good') return 'var(--accent)';
    if (g === 'Average') return 'var(--accent4)';
    return 'var(--accent2)';
  };

  const gradeTag = (g) => {
    if (g === 'Excellent') return 'tag-green';
    if (g === 'Good') return 'tag-purple';
    if (g === 'Average') return 'tag-amber';
    return 'tag-pink';
  };

  return (
    <div className="feedback-page fade-in">
      {/* Header */}
      <div className="feedback-header">
        <div>
          <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Interview Report</h2>
          <div style={{ fontSize:12, color:'var(--text2)', fontFamily:'DM Mono,monospace' }}>
            {interview.technology} · {interview.experienceLevel} · {new Date(interview.completedAt || interview.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Link to="/history" className="btn btn-ghost btn-sm">← All Reports</Link>
          <Link to="/interview" className="btn btn-primary btn-sm">Retake →</Link>
        </div>
      </div>

      {/* Score + Metrics */}
      <div className="grid-2" style={{ marginBottom:20 }}>
        <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
          <div className="score-ring-wrap">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg3)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none"
                stroke={score >= 75 ? 'var(--accent3)' : score >= 50 ? 'var(--accent)' : 'var(--accent2)'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transform:'rotate(-90deg)', transformOrigin:'60px 60px', transition:'stroke-dashoffset 1.2s ease' }}
              />
            </svg>
            <div className="score-ring-inner">
              <div className="score-big">{score}</div>
              <div className="score-sub mono">/ 100</div>
            </div>
          </div>
          <div style={{ textAlign:'center' }}>
            <span className={`tag ${score>=75?'tag-green':score>=50?'tag-purple':'tag-pink'}`}>
              {score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 50 ? 'Average' : 'Needs Work'}
            </span>
            <div style={{ fontSize:11, color:'var(--text2)', marginTop:8, fontFamily:'DM Mono,monospace' }}>
              {answers.filter(a=>!a.skipped).length}/{interview.analytics?.totalQuestions||10} questions answered
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Performance Metrics</div>
          {Object.keys(metrics).length > 0
            ? Object.entries(metrics).map(([key, val]) => (
              <div key={key} className="metric-row">
                <div className="metric-name">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</div>
                <div style={{ flex:1 }}>
                  <div className="progress-bar">
                    <div className="progress-fill"
                      style={{ width:`${val}%`, background: val>=75?'linear-gradient(90deg,#43e97b,#38f9d7)':val>=50?'linear-gradient(90deg,var(--accent),var(--accent-light))':'linear-gradient(90deg,#ff6584,#ff9a9e)' }}
                    />
                  </div>
                </div>
                <div className="metric-val mono">{val}%</div>
              </div>
            ))
            : [['Technical Accuracy',score],['Communication',Math.round(score*0.95)],['Problem Solving',Math.round(score*0.88)],['Code Knowledge',Math.round(score*1.05)],['System Thinking',Math.round(score*0.82)]].map(([n,v]) => (
              <div key={n} className="metric-row">
                <div className="metric-name">{n}</div>
                <div style={{ flex:1 }}>
                  <div className="progress-bar">
                    <div className="progress-fill fill-purple" style={{ width:`${Math.min(100,v)}%` }} />
                  </div>
                </div>
                <div className="metric-val mono">{Math.min(100,v)}%</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Per-Question Breakdown */}
      <div className="section-title" style={{ marginBottom:14 }}>Question-by-Question Analysis</div>
      <div className="answers-list">
        {answers.map((ans, i) => (
          <div key={i} className="answer-item card2">
            <div className="answer-header">
              <div className="answer-num mono">Q{i + 1}</div>
              <div className="answer-question">{ans.question}</div>
              <div className="answer-score-badge" style={{ color: gradeColor(ans.aiAnalysis?.grade) }}>
                {ans.aiAnalysis?.score ?? '--'}<span style={{ fontSize:10 }}>/100</span>
              </div>
            </div>
            {ans.userAnswer && ans.userAnswer !== '[Skipped]' && (
              <div className="answer-user-text">
                <span className="mono" style={{ fontSize:10, color:'var(--text3)' }}>YOUR ANSWER </span>
                {ans.userAnswer.length > 200 ? ans.userAnswer.substring(0, 200) + '...' : ans.userAnswer}
              </div>
            )}
            {ans.skipped && <div className="skipped-badge">⏭ Skipped</div>}
            {ans.aiAnalysis?.feedback && (
              <div className="answer-feedback">
                <span className="feedback-dot" />
                {ans.aiAnalysis.feedback}
              </div>
            )}
            <div className="answer-footer">
              {ans.aiAnalysis?.grade && <span className={`tag ${gradeTag(ans.aiAnalysis.grade)}`}>{ans.aiAnalysis.grade}</span>}
              {ans.aiAnalysis?.strengths?.map(s => (
                <span key={s} className="mini-chip strength">✓ {s}</span>
              ))}
              {ans.aiAnalysis?.improvements?.slice(0,1).map(s => (
                <span key={s} className="mini-chip improvement">→ {s}</span>
              ))}
            </div>
          </div>
        ))}
        {answers.length === 0 && (
          <div style={{ textAlign:'center', padding:32, color:'var(--text2)', fontSize:13 }}>
            Answer details will appear here once you complete the interview.
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="section-title" style={{ margin:'24px 0 14px' }}>Recommendations</div>
      <div className="grid-3">
        {[
          { icon:'📖', title:'Review Core Concepts', desc:`Brush up on ${interview.technology} fundamentals to strengthen your foundations.`, priority:'High' },
          { icon:'💻', title:'Build a Project', desc:'Apply what you know by building a real-world project to solidify understanding.', priority:'Medium' },
          { icon:'🎤', title:'More Mock Interviews', desc:'Practice 2–3 more sessions this week to build confidence and speed.', priority:'High' },
        ].map(rec => (
          <div key={rec.title} className="card2">
            <div style={{ fontSize:24, marginBottom:10 }}>{rec.icon}</div>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>{rec.title}</div>
            <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.6, marginBottom:10 }}>{rec.desc}</div>
            <span className={`tag ${rec.priority==='High'?'tag-pink':'tag-amber'}`}>{rec.priority} Priority</span>
          </div>
        ))}
      </div>
    </div>
  );
}
