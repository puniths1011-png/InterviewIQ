import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sections
import Hero from '../components/sections/Hero';
import HowItWorks from '../components/sections/HowItWorks';
import Features from '../components/sections/Features';
import InterviewShowcase from '../components/sections/InterviewShowcase';
import ResumeShowcase from '../components/sections/ResumeShowcase';

import './Home.css';

const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="final-cta-section">
      <div className="cta-background">
        <div className="blob blob-cta"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="glass-panel cta-card"
      >
        <h2>Start Your AI Interview Journey Today</h2>
        <p>Join thousands of professionals mastering their technical interview skills with our intelligent preparation engine.</p>
        <div className="cta-btns">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/interview')}>Start Interview</button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/resume')}>Analyze Resume</button>
        </div>
      </motion.div>
    </section>
  );
};

export function Home() {
  return (
    <div className="home-page">
      <Hero />
      <HowItWorks />
      <Features />
      <InterviewShowcase />
      <ResumeShowcase />
      <FinalCTA />
    </div>
  );
}

export default Home;
