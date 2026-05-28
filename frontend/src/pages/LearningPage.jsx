import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { mockLearningPaths } from '../services/MockService';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function LearningPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        
        // Use mock data first for immediate updates as requested
        if (mockLearningPaths && mockLearningPaths.length > 0) {
          setTopics(mockLearningPaths);
          setLoading(false);
          return;
        }

        const response = await learningAPI.getAll();
        if (response.success) {
          setTopics(response.materials);
        }
      } catch (err) {
        console.error("Error fetching learning paths:", err);
        setError(err.message || "Failed to load learning paths. Check backend connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const categories = ['All', ...new Set(topics.map(t => t.category))];
  const filtered = activeCategory === 'All' ? topics : topics.filter(t => t.category === activeCategory);
  const levelTag = { 'Beginner': 'badge-success', 'Intermediate': 'badge-primary', 'Advanced': 'badge-primary' };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div className="loader-ring" />
        <p style={{ color: 'var(--text-muted)' }}>Loading learning paths...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Connection Error</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="learning-page">
      <div className="section-header">
        <h2 className="section-title">Learning Paths</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} className={`btn ${activeCategory === c ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        <motion.div variants={item} className="learning-list">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(topic => (
              <div key={topic.id}
                className="card glass card-hover"
                style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => navigate(`/learning/${topic.id}`)}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: topic.color || 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, border: '1px solid var(--border)' }}>
                  {topic.emoji || '📖'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{topic.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{topic.desc}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                  <span className={`badge ${levelTag[topic.level] || 'badge-primary'}`}>{topic.level}</span>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{topic.modules || 0} modules</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No topics found in this category.</div>}
          </div>
        </motion.div>

        <motion.div variants={item} className="learning-sidebar">
          <div className="card glass" style={{ marginBottom: '1.5rem' }}>
            <div className="section-header" style={{ marginBottom: '1.25rem' }}>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>🔥 Trending Now</h3>
            </div>
            {[
              { title: 'React 19 New Features', tag: 'New', desc: 'use() hook, Server Components, Form Actions.', tagClass: 'badge-success' },   
              { title: 'AI Integration Patterns', tag: 'Hot', desc: 'LLMs, vector databases, RAG patterns.', tagClass: 'badge-primary' },        
              { title: 'TypeScript 5.x Updates', tag: 'Updated', desc: 'Decorator metadata, and more.', tagClass: 'badge-primary' },
            ].map((item, idx) => (
              <div key={item.title} style={{ padding: '1rem 0', borderBottom: idx === 2 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.title}</div>
                  <span className={`badge ${item.tagClass}`} style={{ fontSize: '0.65rem' }}>{item.tag}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="card glass">
            <div className="section-header" style={{ marginBottom: '1.25rem' }}>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>📚 Quick Reference</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['SOLID Principles', 'Big O Notation', 'REST vs GraphQL', 'Microservices', 'CAP Theorem', 'Auth Patterns', 'Design Patterns', 'SQL vs NoSQL'].map(ref => (
                <button key={ref} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
                  📋 {ref}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FlashcardsPage() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ easy: 0, hard: 0, skip: 0 });
  const [filter, setFilter] = useState('All');

  const FLASHCARDS = [
    { q: 'What is a closure in JavaScript?', a: 'A closure is a function that retains access to its outer scope even after the outer function has finished executing.', tech: 'JavaScript', difficulty: 'Medium' },
    { q: 'What is event delegation?', a: 'Attaching a single event listener to a parent element to handle events from child elements via bubbling.', tech: 'JavaScript', difficulty: 'Easy' },
    { q: 'Explain the virtual DOM.', a: 'A lightweight in-memory representation of the real DOM used for efficient updates.', tech: 'React', difficulty: 'Easy' },
    { q: 'What is the Node.js event loop?', a: 'A mechanism that allows Node.js to perform non-blocking I/O by offloading operations to the kernel.', tech: 'Node.js', difficulty: 'Medium' },
  ];

  const techs = ['All', ...new Set(FLASHCARDS.map(f => f.tech))];
  const filtered = filter === 'All' ? FLASHCARDS : FLASHCARDS.filter(f => f.tech === filter);
  const card = filtered[idx % filtered.length];
  const progress = Math.round(((stats.easy + stats.hard + stats.skip) / filtered.length) * 100);

  const rate = (type) => {
    setStats(s => ({ ...s, [type]: s[type] + 1 }));
    setFlipped(false);
    setIdx(i => (i + 1) % filtered.length);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {techs.map(t => (
          <button key={t} className={`btn ${filter === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setFilter(t); setIdx(0); setFlipped(false); }}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}> 
        <span className="mono">Card {(idx % filtered.length) + 1} of {filtered.length}</span>
        <span className="mono">{progress}% Reviewed</span>
      </div>
      <div style={{ height: '6px', background: 'var(--bg-soft)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <div style={{ height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>

      <motion.div
        layout
        onClick={() => setFlipped(f => !f)}
        className="card glass"
        style={{
          padding: '4rem 2rem', cursor: 'pointer', minHeight: '300px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', position: 'relative', borderRadius: 'var(--radius-lg)'
        }}
      >
        <span className="badge badge-primary" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>{card.tech}</span>
        <span className="badge badge-success" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>{card.difficulty}</span>

        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>❔</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.5 }}>{card.q}</div>
            </motion.div>
          ) : (
            <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>💡</div>
              <div style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '480px' }}>{card.a}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ position: 'absolute', bottom: '1.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          {flipped ? 'Click to show question' : 'Click to reveal answer'}
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2.5rem 0' }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => rate('skip')}>Skip</button>
        <button className="btn btn-secondary" style={{ flex: 1, color: 'var(--danger)' }} onClick={() => rate('hard')}>Hard</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => rate('easy')}>Mastered</button>
      </div>
    </motion.div>
  );
}

export function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ fontSize: '8rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '1rem 0' }}>System Redirect Failed</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
          The requested module could not be found in the current workspace.
        </p>
        <a href="/" className="btn btn-primary btn-lg">Return to Base</a>
      </motion.div>
    </div>
  );
}

export default LearningPage;
