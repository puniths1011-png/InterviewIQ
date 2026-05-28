import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const InterviewShowcase = () => {
  const navigate = useNavigate();

  return (
    <section id="interview-showcase" className="tool-showcase-section">
      <div className="showcase-container">
        <div className="showcase-info">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="section-badge"
          >
            AI Mock Interview
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Experience Realistic <br />
            <span className="gradient-text">AI-Driven Technical Mock Sessions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our intelligent AI interviewer, powered by Claude 3.5 Sonnet, 
            conducts deep technical sessions tailored to your specific tech stack 
            and experience level. Receive instant, data-backed feedback on your 
            technical accuracy, communication, and problem-solving approach.
          </motion.p>
          
          <motion.ul 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="feature-list"
          >
            <li>✨ Realistic AI Conversation</li>
            <li>✨ 20+ Modern Tech Stacks</li>
            <li>✨ Personalized Performance Feedback</li>
            <li>✨ Dynamic Difficulty Scaling</li>
          </motion.ul>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/interview')}
            style={{ marginTop: '2rem' }}
          >
            Start AI Mock Interview
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="showcase-visual"
        >
          <div className="glass-panel tool-card">
            <div className="card-header">
              <h3>Interview Setup</h3>
              <div className="status-indicator">Ready</div>
            </div>
            <div className="card-body">
              <div className="setup-item">
                <label>Technology Stack</label>
                <div className="mock-select">React / Node.js / TypeScript</div>
              </div>
              <div className="setup-item">
                <label>Experience Level</label>
                <div className="mock-select">Mid-Level (2-5 Years)</div>
              </div>
              <div className="interviewer-preview">
                <div className="ai-avatar">🤖</div>
                <div className="ai-info">
                  <h4>AI Interviewer</h4>
                  <p>Technical Lead Agent</p>
                </div>
              </div>
              <div className="voice-mode-toggle">
                <span>Voice Interaction Mode</span>
                <div className="toggle-switch active"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InterviewShowcase;
