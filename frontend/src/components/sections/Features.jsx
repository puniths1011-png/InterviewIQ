import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Mock Interview',
      desc: 'Conduct realistic technical interviews with our intelligent AI interviewer.',
      icon: '🤖',
      path: '/interview'
    },
    {
      title: 'Resume Analysis',
      desc: 'Get deep technical insights and optimize your profile for tech roles.',
      icon: '📄',
      path: '/resume'
    },
    {
      title: 'ATS Score Checker',
      desc: 'Check if your resume is optimized for Applicant Tracking Systems.',
      icon: '🎯',
      path: '/ats-score'
    },
    {
      title: 'MCQ Assessments',
      desc: 'Validate your knowledge across 20+ modern tech stacks.',
      icon: '🧩',
      path: '/mcq'
    },
    {
      title: 'Flashcards',
      desc: 'Master core foundations with our interactive spaced-repetition system.',
      icon: '🃏',
      path: '/flashcards'
    },
    {
      title: 'Learning Materials',
      desc: 'Explore curated study guides and technical documentation.',
      icon: '📚',
      path: '/learning'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="section-badge"
        >
          Features
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Everything You Need to <span className="gradient-text">Level Up</span>
        </motion.h2>
      </div>

      <div className="features-grid">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card feature-card"
            onClick={() => navigate(feature.path)}
          >
            <div className="feature-icon-wrapper">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <div className="feature-cta">
              Explore Now <span className="arrow">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
