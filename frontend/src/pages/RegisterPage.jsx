import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', experienceLevel: 'junior' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
            Join thousands of professionals mastering their technical interview skills with our intelligent preparation engine.
          </p>
          
          <div className="branding-features">
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              Accelerate Your Career Growth
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              Expert-Level Question Databases
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              Data-Driven Feedback Loops
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              Secure & Professional Environment
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
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">Start your professional preparation today</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="auth-label">Full Name</label>
              <input 
                className="auth-input" 
                type="text" 
                placeholder="John Doe" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="auth-label">Email Address</label>
              <input 
                className="auth-input" 
                type="email" 
                placeholder="you@professional.com" 
                value={form.email} 
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                autoComplete="off"
                required 
              />
            </div>
            <div className="form-group">
              <label className="auth-label">Password</label>
              <input 
                className="auth-input" 
                type="password" 
                placeholder="Min. 6 characters" 
                value={form.password} 
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                autoComplete="new-password"
                required 
              />
            </div>
            <div className="form-group">
              <label className="auth-label">Experience Level</label>
              <select 
                className="auth-input" 
                style={{ appearance: 'none' }}
                value={form.experienceLevel} 
                onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))}
              >
                <option value="junior">Junior (0–2 years)</option>
                <option value="mid">Mid-level (2–5 years)</option>
                <option value="senior">Senior (5+ years)</option>
                <option value="expert">Expert / Staff</option>
              </select>
            </div>
            <button className="btn btn-primary auth-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
