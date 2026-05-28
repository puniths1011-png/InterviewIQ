import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';
import './ResumePage.css';

export default function ResumeUploadPage() {
  const [phase, setPhase] = useState('upload'); // upload | parsing
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFile = async (file) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }

    setError('');
    setPhase('parsing');

    try {
      const res = await resumeAPI.upload(file);
      const resumeData = res?.parsedResume || res?.data?.parsedResume || res;
      
      if (!resumeData) {
        throw new Error('No resume data found in response. Check API logs.');
      }

      // Store in session storage for the analysis page
      sessionStorage.setItem('last_parsed_resume', JSON.stringify(resumeData));
      navigate('/resume/analysis');
    } catch (err) {
      setError(err.message || 'Failed to parse document. Please ensure it contains readable text.');
      setPhase('upload');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="resume-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="resume-main">
        {phase === 'upload' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Analyze Your Background</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Upload your resume to receive an AI-powered ATS score and technical breakdown.</p>
              
              <div
                className={`upload-zone glass ${dragOver ? 'drag-over' : ''}`}
                style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: '20px', 
                  padding: '5rem 2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: dragOver ? 'var(--hover-bg)' : 'transparent'
                }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" hidden onChange={e => handleFile(e.target.files[0])} />
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📄</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Drop your resume here</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Supports PDF, DOCX, TXT (Max 10MB)</div>
              </div>

              {error && <div className="error-banner" style={{ marginTop: '2rem' }}>{error}</div>}
              
              <div style={{ display:'flex', gap:10, marginTop:40, justifyContent:'center' }}>
                <span className="badge badge-primary">Universal Parser</span>
                <span className="badge badge-success">AI Powered</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card"
            style={{ textAlign: 'center', padding: '5rem 2rem' }}
          >
            <div className="loader-ring" style={{ width:56, height:56, borderWidth:4, marginBottom: 24, margin: '0 auto 2rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Intelligent Document Processing</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Our AI is extracting structural information and analyzing your professional graph...</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto', textAlign: 'left' }}>
              {['Extracting raw text data','Normalizing entities & skills','Mapping professional history','Calculating ATS compatibility'].map((s,i) => (
                <motion.div 
                  key={s} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}
                >
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                  {s}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
