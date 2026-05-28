import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MCQPage.css';

const TECHS = [
  { name:'React', emoji:'⚛️', cat:'Frontend', color:'#4F46E5' },
  { name:'Node.js', emoji:'🟢', cat:'Backend', color:'#10B981' },
  { name:'MongoDB', emoji:'🍃', cat:'Database', color:'#F59E0B' },
  { name:'Express.js', emoji:'⚡', cat:'Backend', color:'#10B981' },
  { name:'TypeScript', emoji:'📘', cat:'Language', color:'#38bdf8' },
  { name:'JavaScript', emoji:'🟡', cat:'Language', color:'#F59E0B' },
  { name:'CSS3', emoji:'🎨', cat:'Styling', color:'#EC4899' },
  { name:'Next.js', emoji:'🔥', cat:'Framework', color:'#4F46E5' },
  { name:'Python', emoji:'🐍', cat:'Language', color:'#10B981' },
  { name:'Java', emoji:'☕', cat:'Language', color:'#F59E0B' },
  { name:'Docker', emoji:'🐳', cat:'DevOps', color:'#38bdf8' },
  { name:'Kubernetes', emoji:'☸️', cat:'DevOps', color:'#38bdf8' },
  { name:'GraphQL', emoji:'🔄', cat:'API', color:'#EC4899' },
  { name:'SQL', emoji:'📊', cat:'Database', color:'#F59E0B' },
  { name:'REST APIs', emoji:'🔧', cat:'API', color:'#38bdf8' },
  { name:'PostgreSQL', emoji:'🐘', cat:'Database', color:'#38bdf8' },
  { name:'ML Basics', emoji:'🤖', cat:'AI', color:'#4F46E5' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function MCQSelectorPage() {
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();

  const handleSelect = (tech) => {
    navigate(`/mcq/quiz/${tech.name}`, { state: { tech, difficulty } });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mcq-selector fade-in">
      <div className="selector-header">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Choose Technology</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Select a topic and start your assessment</p>
        </div>
        <select className="form-select" style={{ width: 180 }} value={difficulty}
          onChange={e => setDifficulty(e.target.value)}>
          <option value="">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="tech-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {TECHS.map(t => (
          <motion.div 
            key={t.name} 
            variants={item}
            className="tech-card card card-hover" 
            style={{ textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            onClick={() => handleSelect(t)}
          >
            <div className="tech-emoji" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t.emoji}</div>
            <div className="tech-name" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{t.name}</div>
            <div className="tech-cat mono" style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', textTransform: 'uppercase' }}>{t.cat}</div>
            <div className="tech-dot-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: t.color }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
