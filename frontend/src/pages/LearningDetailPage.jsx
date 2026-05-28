import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { learningAPI } from '../services/api';
import { mockLearningPaths } from '../services/MockService';

export default function LearningDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPathData = async () => {
      try {
        setLoading(true);

        // Check mock data first
        const mockPath = mockLearningPaths.find(p => p.id === parseInt(id));
        if (mockPath) {
          setPath(mockPath);
          setLoading(false);
          return;
        }

        const data = await learningAPI.getById(id);
        setPath(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching learning path:", err);
        setError(err.message || "Failed to load learning material. Please ensure the backend is running and the ID is correct.");
      } finally {
        setLoading(false);
      }
    };

    fetchPathData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div className="loader-ring" />
        <p style={{ color: 'var(--text-muted)' }}>Fetching modules from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Connection Error</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/learning')}>Back to Paths</button>
      </div>
    );
  }

  if (!path) return <div style={{ padding: '2rem' }}>Path not found (ID: {id})</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem', paddingLeft: 0 }} onClick={() => navigate('/learning')}>
            ← Back to Learning Paths
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--text-main), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {path.title}
          </h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge badge-primary" style={{ padding: '0.4rem 0.8rem' }}>{path.level}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>• {path.topics?.length || 0} Modules</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {path.topics?.map((topic, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card glass card-hover" 
            style={{ 
              padding: '2rem', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px'
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'var(--primary-light)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--primary)'
            }}>
              {index + 1}
            </div>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              {topic.name}
            </h3>
            
            <div style={{ flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topic.content?.map((item, i) => (
                  <li key={i} style={{ 
                    fontSize: '0.95rem', 
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    lineHeight: 1.4
                  }}>
                    <span style={{ color: 'var(--primary)', marginTop: '0.2rem' }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
