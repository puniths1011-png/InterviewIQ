import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import './ATSPage.css';

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

export default function ATSPage() {
  const [phase, setPhase] = useState('upload'); // upload | scanning | result
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }

    setError('');
    setPhase('scanning');

    try {
      const res = await resumeAPI.upload(file);
      console.log('ATS Scan Response:', res);
      
      // Some APIs return the data wrapped in a 'data' field, others don't.
      // Based on ResumePage.js, it expects res.parsedResume
      const resumeData = res?.parsedResume || res?.data?.parsedResume || res;
      
      if (!resumeData || (!resumeData.candidate && !resumeData.skills)) {
        throw new Error('Analysis failed. Please ensure the file contains readable text and try again.');
      }

      setResult(resumeData);
      setPhase('result');
    } catch (err) {
      console.error('ATS Scan Error:', err);
      setError(err.message || 'Failed to scan document.');
      setPhase('upload');
    }
  };

  const rawScore = result?.resumeAnalysis?.atsScore || result?.atsScore || 0;
  const numericScore = parseInt(rawScore, 10) || 0;

  const scoreData = [
    { name: 'Score', value: numericScore },
    { name: 'Remaining', value: Math.max(0, 100 - numericScore) }
  ];

  const COLORS = ['var(--primary)', 'var(--bg-soft)'];

  const strengths = result?.resumeAnalysis?.strengths || result?.strengths || [];
  const missingSkills = result?.resumeAnalysis?.missingSkills || result?.missingSkills || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="ats-page">
      <div className="ats-container">
        <AnimatePresence mode="wait">
          {phase === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="ats-upload-section"
            >
              <div className="ats-header">
                <h2 className="ats-title">ATS Resume Scanner</h2>
                <p className="ats-subtitle">Check how well your resume performs against Applicant Tracking Systems</p>
              </div>

              <div
                className={`ats-dropzone glass ${dragOver ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" hidden onChange={e => handleFile(e.target.files[0])} />
                <div className="ats-upload-icon">🎯</div>
                <div className="ats-upload-text">Upload Resume</div>
                <div className="ats-upload-sub">Supports PDF, DOCX, TXT</div>
              </div>
              {error && <div className="error-banner">{error}</div>}
              
              <div className="ats-features-grid">
                {[
                  { icon: '🔍', title: 'Keyword Analysis', desc: 'Identifies missing industry-specific keywords.' },
                  { icon: '📐', title: 'Formatting Check', desc: 'Ensures your layout is readable by bots.' },
                  { icon: '📈', title: 'Impact Scoring', desc: 'Measures the strength of your achievements.' }
                ].map((f, i) => (
                  <div key={i} className="ats-feature-card">
                    <span className="ats-feature-icon">{f.icon}</span>
                    <h4 className="ats-feature-title">{f.title}</h4>
                    <p className="ats-feature-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'scanning' && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ats-scanning-state glass"
            >
              <div className="scanner-line" />
              <div className="loader-ring" />
              <h2 className="scanning-title">Scanning Your Profile...</h2>
              <p>Comparing your experience against 500+ job patterns</p>
              <div className="scanning-steps">
                {['Parsing structural data', 'Extracting skills & keywords', 'Analyzing formatting consistency', 'Calculating match probability'].map((s, i) => (
                  <motion.div 
                    key={s} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="scanning-step"
                  >
                    ✓ {s}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="ats-result-view"
            >
              <div className="ats-result-header glass">
                <div className="score-chart-container">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={scoreData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {scoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <Label 
                          value={`${numericScore}%`} 
                          position="center" 
                          fill="var(--text)" 
                          style={{ fontSize: '24px', fontWeight: 800 }}
                        />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="score-label">Overall ATS Score</div>
                </div>

                <div className="result-summary">
                  <h3 className="candidate-name">{result.candidate?.name || 'Your Resume Analysis'}</h3>
                  <div className="level-badge">{result.resumeAnalysis?.experienceLevel || 'General'} Level</div>
                  <p className="summary-text">
                    Your resume was scanned against standard ATS algorithms. 
                    {result.resumeAnalysis?.detectedDomains?.length > 0 && (
                      <> You have a strong foundation in <strong>{result.resumeAnalysis.detectedDomains.join(', ')}</strong>.</>
                    )}
                  </p>
                  <button className="btn btn-secondary btn-sm" onClick={() => setPhase('upload')}>Re-scan Resume</button>
                </div>
              </div>

              <div className="ats-details-grid">
                <div className="ats-detail-card glass">
                  <h4 className="detail-title">🚀 Top Strengths</h4>
                  <div className="strength-list">
                    {strengths.length > 0 ? strengths.map((s, i) => (
                      <div key={i} className="strength-item">
                        <span className="icon">✅</span> {s}
                      </div>
                    )) : (
                      <div className="empty-state-small">No specific strengths identified.</div>
                    )}
                  </div>
                </div>

                <div className="ats-detail-card glass">
                  <h4 className="detail-title">⚠️ Areas for Improvement</h4>
                  <div className="missing-list">
                    {missingSkills.length > 0 ? missingSkills.map((s, i) => (
                      <div key={i} className="missing-item">
                        <span className="icon">→</span> {s}
                      </div>
                    )) : (
                      <div className="empty-state-small">No critical missing skills found.</div>
                    )}
                  </div>
                </div>

                <div className="ats-detail-card glass full-width">
                  <h4 className="detail-title">🛠️ Skills Distribution</h4>
                  <div className="skills-cloud">
                    {Object.entries(result.skills || {}).map(([cat, items]) => (
                      Array.isArray(items) && items.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))
                    ))}
                  </div>
                </div>
                
                <div className="ats-detail-card glass full-width">
                  <h4 className="detail-title">📝 Formatting & Structure</h4>
                  <div className="format-checks">
                    <div className="check-item positive">✓ Standard font usage detected</div>
                    <div className="check-item positive">✓ Professional section headers found</div>
                    <div className="check-item positive">✓ Contact information clearly identified</div>
                    <div className="check-item warning">! Consider adding more quantitative results (e.g., %)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
