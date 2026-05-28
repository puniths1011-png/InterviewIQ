import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResumeShowcase = () => {
  const navigate = useNavigate();

  return (
    <section id="resume-showcase" className="tool-showcase-section reverse">
      <div className="showcase-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="showcase-visual"
        >
          <div className="glass-panel tool-card resume-card">
            <div className="card-header">
              <h3>Resume Intelligence</h3>
              <div className="status-indicator success">Uploaded</div>
            </div>
            <div className="card-body">
              <div className="ats-score-display">
                <div className="score-ring">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">85%</text>
                  </svg>
                </div>
                <div className="score-label">ATS Score</div>
              </div>

              <div className="analysis-tags">
                <div className="analysis-tag positive">✓ React Mastery</div>
                <div className="analysis-tag positive">✓ AWS Experience</div>
                <div className="analysis-tag warning">! Add Docker Skills</div>
              </div>

              <div className="keyword-match">
                <div className="match-label">Keyword Match Rate</div>
                <div className="match-bar"><div className="match-fill" style={{ width: '92%' }}></div></div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="showcase-info">
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="section-badge"
          >
            Resume & ATS Optimization
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Optimized for <br />
            <span className="gradient-text">Recruitment Intelligence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Don't let your resume get lost in the noise. Our advanced AI scans 
            your profile using modern ATS algorithms to identify missing technical 
            keywords, formatting errors, and skill gaps that prevent you from 
            reaching human recruiters.
          </motion.p>
          
          <motion.ul 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="feature-list"
          >
            <li>✨ Deep Technical Profile Analysis</li>
            <li>✨ ATS Compatibility Scoring</li>
            <li>✨ Intelligent Keyword Recommendations</li>
            <li>✨ Formatting & Structure Quality Check</li>
          </motion.ul>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/resume')}
            style={{ marginTop: '2rem' }}
          >
            Analyze My Resume
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ResumeShowcase;
