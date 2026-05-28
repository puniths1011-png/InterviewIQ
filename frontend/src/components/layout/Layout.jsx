import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { journeyTracker } from '../../services/MockService';
import './Layout.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page views
  useEffect(() => {
    journeyTracker.trackEvent('Page View', { title: document.title });
  }, [location.pathname]);

  const scrollToSection = (id) => {
    journeyTracker.trackEvent('Scroll To Section', { sectionId: id });
    if (!isHomePage) {
      navigate('/#' + id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Features', id: 'features' },
    { label: 'AI Interview', dropdown: [
      { label: 'Mock Interview', path: '/interview' },
      { label: 'Resume Analysis', path: '/resume' },
      { label: 'ATS Checker', path: '/ats-score' }
    ]},
    { label: 'Practice', dropdown: [
      { label: 'MCQ Assessments', path: '/mcq' },
      { label: 'Flashcards', path: '/flashcards' },
      { label: 'Learning Materials', path: '/learning' }
    ]},
    { label: 'Progress', dropdown: [
      { label: 'History', path: '/history' },
      { label: 'Leaderboard', path: '/leaderboard' },
      { label: 'Settings', path: '/settings' }
    ]},
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">IQ</div>
          <span className="logo-text">InterviewIQ <span className="logo-ai">AI</span></span>
        </div>

        <div className="nav-links">
          {navItems.map((item, idx) => (
            <div key={idx} className="nav-item-container">
              {item.id ? (
                <button className="nav-link-btn" onClick={() => scrollToSection(item.id)}>
                  {item.label}
                </button>
              ) : (
                <div className="nav-dropdown-trigger">
                  {item.label} <span className="chevron">▼</span>
                  <div className="nav-dropdown">
                    {item.dropdown.map((sub, sidx) => (
                      <NavLink key={sidx} to={sub.path} className="dropdown-item">
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-item-container">
                <div className="nav-user">
                  <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
                  <div className="nav-dropdown user-dropdown">
                    <div className="dropdown-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <NavLink to="/dashboard" className="dropdown-item">Dashboard</NavLink>
                    <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
                    <button className="dropdown-item logout-btn" onClick={logout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary nav-cta" onClick={() => navigate('/interview')}>
                Start Interview
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-primary nav-cta" onClick={() => navigate('/register')}>
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`layout-v2 ${isHomePage ? 'home-v2' : ''}`}>
      <Navbar />
      <main className="main-content-v2">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>
      {isHomePage && (
        <footer className="footer-v2">
          <div className="footer-container">
            <div className="footer-brand">
              <div className="logo-icon">IQ</div>
              <span className="logo-text">InterviewIQ AI</span>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <button onClick={() => scrollToSection('features')}>Features</button>
                <NavLink to="/interview">AI Interview</NavLink>
                <NavLink to="/mcq">MCQ Prep</NavLink>
              </div>
              <div className="footer-col">
                <h4>Resources</h4>
                <NavLink to="/learning">Learning Path</NavLink>
                <NavLink to="/flashcards">Flashcards</NavLink>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <NavLink to="/privacy">Privacy Policy</NavLink>
                <NavLink to="/terms">Terms of Service</NavLink>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 InterviewIQ AI. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}

import { Outlet } from 'react-router-dom';
