import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI, interviewsAPI } from '../services/api';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [interviews, setInterviews] = useState([]);
  
  useEffect(() => {
    usersAPI.getDashboard().then(r => setData(r.data)).catch(() => {});
    interviewsAPI.getAll({ limit: 5, status: 'completed' }).then(r => setInterviews(r.data || [])).catch(() => {});
  }, []);

  const weekData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => ({
    day: d, questions: [8, 15, 6, 20, 12, 25, 18][i]
  }));

  const stats = [
    { icon: '📅', label: 'Questions Solved', val: '42', color: 'var(--primary)', detail: 'This Week' },
    { icon: '⏱️', label: 'Average Time', val: '1.8m', color: '#6366F1', detail: 'Per Question' },
    { icon: '🔥', label: 'Hard Questions', val: '31', color: '#8B5CF6', detail: 'Mastered' },
    { icon: '📊', label: 'Global Ranking', val: data?.user?.stats?.points > 0 ? '#142' : '—', color: '#F59E0B', detail: 'Top 5%' }
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="dashboard">
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item} className="card card-hover">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{stat.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, margin: '0.5rem 0' }}>{stat.val}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{stat.detail}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        <motion.div variants={item} className="card">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Weekly Activity</h3>
            <span className="badge-primary">Daily Progress</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: 'var(--text-dim)' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ 
                  background: '#FFFFFF', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  color: 'var(--text-primary)'
                }} 
              />
              <Bar dataKey="questions" radius={[6, 6, 0, 0]}>
                {weekData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? 'var(--primary)' : '#818CF8'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Technical Mastery</h3>
            <span className="badge badge-success">Top Skills</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { name: 'React', progress: 82, color: 'var(--primary)' },
              { name: 'Node.js', progress: 68, color: 'var(--secondary)' },
              { name: 'MongoDB', progress: 54, color: 'var(--accent)' },
              { name: 'TypeScript', progress: 45, color: 'var(--primary-light)' }
            ].map((skill) => (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{skill.name}</span>
                  <span className="mono" style={{ color: 'var(--text-muted)' }}>{skill.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ height: '100%', background: skill.color, borderRadius: '10px' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="card">
        <div className="section-header">
          <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Recent Interview Sessions</h3>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>View All History</button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {interviews.length === 0
            ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                <p>No interview sessions recorded yet.</p>
                <a href="/interview" className="btn btn-primary" style={{ marginTop: '1rem' }}>Take Your First Mock Interview</a>
              </div>
            : interviews.map((iv, idx) => (
              <div key={iv._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1rem 0', 
                borderBottom: idx === interviews.length - 1 ? 'none' : '1px solid var(--border)' 
              }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--primary-bg)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 800, 
                  color: 'var(--primary)',
                  border: '1px solid rgba(79, 70, 229, 0.2)'
                }}>
                  {iv.analytics?.overallScore || '--'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{iv.technology}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(iv.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {iv.type}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${iv.analytics?.overallScore > 70 ? 'badge-success' : 'badge-primary'}`}>
                    {iv.analytics?.overallScore > 70 ? 'Good' : 'Practice'}
                  </span>
                  <button onClick={() => window.location.href=`/feedback/${iv._id}`} className="btn btn-secondary btn-sm">
                    Review
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </motion.div>
    </motion.div>
  );
}
