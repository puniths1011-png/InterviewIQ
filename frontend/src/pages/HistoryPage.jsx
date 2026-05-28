import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewsAPI } from '../services/api';

export default function HistoryPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status:'', technology:'' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    interviewsAPI.getAll({ page, limit:10, ...filter })
      .then(r => { setInterviews(r.data || []); setTotal(r.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview session?')) return;
    try {
      await interviewsAPI.delete(id);
      setInterviews(prev => prev.filter(iv => iv._id !== id));
    } catch (err) { alert('Failed to delete.'); }
  };

  const scoreColor = (s) => s >= 75 ? 'var(--accent3)' : s >= 50 ? 'var(--accent)' : 'var(--accent2)';
  const typeIcon = (t) => ({ 'ai-mock':'🤖', 'resume-based':'📄', 'mcq-session':'🧩' }[t] || '🤖');

  return (
    <div className="fade-in">
      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <h2 style={{ fontSize:17, fontWeight:700, flex:1 }}>Interview History</h2>
        <select className="form-select" style={{ width:160 }} value={filter.status} onChange={e => setFilter(f=>({...f,status:e.target.value}))}>
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="abandoned">Abandoned</option>
        </select>
        <select className="form-select" style={{ width:180 }} value={filter.technology} onChange={e => setFilter(f=>({...f,technology:e.target.value}))}>
          <option value="">All Technologies</option>
          {['React & Frontend','Node.js & Backend','Full Stack MERN','TypeScript','MongoDB & Database'].map(t=>(
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <div className="loader-ring" />
        </div>
      ) : interviews.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 24px' }}>
          <div style={{ fontSize:44, marginBottom:14 }}>📭</div>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>No interviews yet</h3>
          <p style={{ fontSize:13, color:'var(--text2)', marginBottom:20 }}>Your interview history will appear here.</p>
          <Link to="/interview" className="btn btn-primary">Start Your First Interview →</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {interviews.map(iv => (
            <div key={iv._id} className="card2 card-hover" style={{ display:'flex', alignItems:'center', gap:16 }}>
              {/* Score badge */}
              <div style={{
                width:52, height:52, borderRadius:'var(--radius-sm)',
                background: `${scoreColor(iv.analytics?.overallScore||0)}18`,
                border: `1px solid ${scoreColor(iv.analytics?.overallScore||0)}35`,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                flexShrink:0
              }}>
                <div style={{ fontSize:16, fontWeight:800, color:scoreColor(iv.analytics?.overallScore||0), lineHeight:1 }}>
                  {iv.analytics?.overallScore || '--'}
                </div>
                <div style={{ fontSize:9, color:'var(--text3)', fontFamily:'DM Mono,monospace' }}>SCORE</div>
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:14 }}>{typeIcon(iv.type)}</span>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{iv.technology}</div>
                  <span className={`tag ${iv.status==='completed'?'tag-green':iv.status==='in-progress'?'tag-amber':'tag-pink'}`} style={{ fontSize:10 }}>
                    {iv.status}
                  </span>
                </div>
                <div style={{ fontSize:11, color:'var(--text2)', fontFamily:'DM Mono,monospace' }}>
                  {iv.experienceLevel} · {new Date(iv.startedAt||iv.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                  {iv.analytics?.totalDuration && ` · ${Math.round(iv.analytics.totalDuration/60)} min`}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                {iv.status === 'completed' && (
                  <Link to={`/feedback/${iv._id}`} className="btn btn-ghost btn-sm">View Report</Link>
                )}
                {iv.status === 'in-progress' && (
                  <Link to="/interview" className="btn btn-primary btn-sm">Continue</Link>
                )}
                <button className="btn btn-sm" style={{ background:'rgba(255,101,132,0.1)', color:'var(--accent2)', border:'1px solid rgba(255,101,132,0.25)' }}
                  onClick={() => handleDelete(iv._id)}>✕</button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {total > 10 && (
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:12 }}>
              <button className="btn btn-ghost btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
              <span style={{ fontSize:12, color:'var(--text2)', padding:'5px 12px', fontFamily:'DM Mono,monospace' }}>
                Page {page} of {Math.ceil(total/10)}
              </span>
              <button className="btn btn-ghost btn-sm" disabled={page>=Math.ceil(total/10)} onClick={()=>setPage(p=>p+1)}>Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
