import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Upload Resume',
      desc: 'Our AI scans your resume to understand your technical profile.',
      icon: '📤'
    },
    {
      title: 'Analyze Skills',
      desc: 'Identify gaps and get personalized recommendations for improvement.',
      icon: '🔍'
    },
    {
      title: 'Practice Interviews',
      desc: 'Engage in realistic AI-driven technical mock sessions.',
      icon: '🤖'
    },
    {
      title: 'Improve Weak Areas',
      desc: 'Master foundations with MCQ assessments and flashcards.',
      icon: '📈'
    },
    {
      title: 'Crack Real Interviews',
      desc: 'Go into your next real-world interview with total confidence.',
      icon: '🏆'
    }
  ];

  return (
    <section id="how-it-works" className="how-section">
      <div className="section-header">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="section-badge"
        >
          The Journey
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          How We Help You <span className="gradient-text">Master Interviews</span>
        </motion.h2>
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
          >
            <div className="timeline-content glass-card">
              <div className="timeline-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              <div className="step-number">{i + 1}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
