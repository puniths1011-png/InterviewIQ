import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      {/* Left Branding Pane */}
      <div className="auth-branding">
        <div className="branding-content">
          <div className="auth-logo-large">IQ</div>
          <h1 className="branding-title">InterviewIQ</h1>
          <p className="branding-subtitle">
            The world's most advanced AI-driven platform for technical interview preparation and career acceleration.
          </p>
          
          <div className="branding-features">
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              AI-Powered Mock Interviews
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              In-Depth Performance Analytics
            </div>
            <div className="feature-item">
              <span className="feature-icon">📄</span>
              Advanced ATS Resume Analysis
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              Tailored Career Pathways
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="auth-form-pane">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="auth-form-card"
        >
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">Sign in to your professional dashboard</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="auth-label">Email Address</label>
              <input 
                className="auth-input" 
                type="email" 
                placeholder="you@professional.com" 
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="auth-label">Password</label>
              <input 
                className="auth-input" 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                required 
              />
            </div>
            <button className="btn btn-primary auth-button" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
