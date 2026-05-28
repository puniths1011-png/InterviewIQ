import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="hero-section">
      <div className="hero-gradient-blob"></div>
      
      <div className="hero-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-badge"
        >
          <span>✨ AI-Powered Interview Preparation Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hero-title"
        >
          Ace Technical Interviews with <br />
          <span className="gradient-text">AI-Powered Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-description"
        >
          Practice technical assessments, conduct mock interviews with AI, and
          receive data-backed feedback to master your next tech challenge.
          Optimize your resume and improve your ATS score autonomously.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hero-ctas"
        >
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/register")}
          >
            Start Preparation
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Features
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-stats"
        >
          <div className="stat-item">
            <strong>10+</strong> <span>AI Interviews</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>100+</strong> <span>Technical Questions</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>95%</strong> <span>ATS Accuracy</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hero-preview"
      >
        <div className="glass-panel preview-card">
          <div className="preview-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <div className="preview-tab">AI Interview Analytics</div>
          </div>
          <div className="preview-body">
            {/* Mock Dashboard Content */}
            <div className="mock-row">
              <div className="mock-item small"></div>
              <div className="mock-item medium"></div>
              <div className="mock-item large"></div>
            </div>
            <div className="mock-chart">
              <div className="bar" style={{ height: "60%" }}></div>
              <div className="bar" style={{ height: "80%" }}></div>
              <div className="bar" style={{ height: "40%" }}></div>
              <div className="bar" style={{ height: "90%" }}></div>
              <div className="bar" style={{ height: "70%" }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
