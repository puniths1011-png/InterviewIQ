import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', experienceLevel: user?.experienceLevel || 'junior' });
  const [passwords, setPasswords] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type:'', text:'' });

  const showMsg = (type, text) => { 
    setMsg({ type, text }); 
    setTimeout(() => setMsg({type:'',text:''}), 3500); 
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(profile);
      updateUser(res.user);
      showMsg('success', 'Profile updated successfully!');
    } catch (err) {
      showMsg('error', err.message || 'Failed to update profile.');
    } finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showMsg('error', 'New passwords do not match.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      showMsg('error', 'Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword:'', newPassword:'', confirmPassword:'' });
      showMsg('success', 'Password changed successfully!');
    } catch (err) {
      showMsg('error', err.message || 'Failed to change password.');
    } finally { setSaving(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Account Profile', icon: '👤' },
    { id: 'preferences', label: 'Interview Prep', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' }
  ];

  return (
    <div className="settings-container fade-in">
      {msg.text && (
        <div className="msg-toast">
          <span>{msg.type === 'success' ? '✅' : '❌'}</span>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{msg.text}</span>
        </div>
      )}

      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </header>

      <div className="settings-grid">
        <aside className="settings-nav">
          {tabs.map(tab => (
            <div 
              key={tab.id} 
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </aside>

        <main className="settings-content">
          {activeTab === 'profile' && (
            <div className="glass-card">
              <div className="section-title"><span>👤</span> Personal Information</div>
              
              <div className="profile-section">
                <div className="profile-avatar-large">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="profile-info">
                  <h3>{user?.name}</h3>
                  <p>{user?.email}</p>
                  <div className="badge tag-purple" style={{ marginTop: '0.5rem' }}>{user?.plan?.toUpperCase()} PLAN</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profile.name}
                  onChange={e => setProfile(p=>({...p, name:e.target.value}))} placeholder="Your full name" />
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={profile.experienceLevel}
                  onChange={e => setProfile(p=>({...p, experienceLevel:e.target.value}))}>
                  <option value="junior">Junior (0–2 years)</option>
                  <option value="mid">Mid-level (2–5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="expert">Expert / Staff</option>
                </select>
              </div>

              <div className="stats-grid" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <div className="stat-card">
                  <span className="stat-value">{user?.stats?.totalInterviews || 0}</span>
                  <span className="stat-label">Interviews</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{user?.stats?.totalQuestions || 0}</span>
                  <span className="stat-label">Questions</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{user?.stats?.points || 0}</span>
                  <span className="stat-label">IQ Points</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{user?.stats?.streak || 0} 🔥</span>
                  <span className="stat-label">Streak</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button className="btn btn-primary btn-lg" onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="glass-card">
              <div className="section-title"><span>⚙️</span> Interview Preferences</div>
              
              {[
                { id: 'mode', label:'Default Interview Mode', options:['Text','Voice'] },
                { id: 'qty', label:'Questions Per Session', options:['5','10','15'] },
                { id: 'time', label:'Time Limit Per Question', options:['1 min','2 min','3 min','No limit'] },
              ].map(pref => (
                <div key={pref.label} className="pref-group">
                  <label className="pref-label">{pref.label}</label>
                  <div className="pref-options">
                    {pref.options.map((opt, i) => (
                      <div 
                        key={opt} 
                        className={`pref-option ${(pref.id === 'mode' && opt === 'Voice') || (pref.id === 'qty' && opt === '10') || (pref.id === 'time' && opt === '2 min') ? 'active' : ''}`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button className="btn btn-primary btn-lg">Update Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card">
              <div className="section-title"><span>🔒</span> Security</div>
              
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" value={passwords.currentPassword}
                  onChange={e => setPasswords(p=>({...p,currentPassword:e.target.value}))} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={passwords.newPassword}
                  onChange={e => setPasswords(p=>({...p,newPassword:e.target.value}))} placeholder="Min 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" value={passwords.confirmPassword}
                  onChange={e => setPasswords(p=>({...p,confirmPassword:e.target.value}))} placeholder="Re-enter new password" />
              </div>
              
              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button className="btn btn-primary btn-lg" onClick={changePassword} disabled={saving || !passwords.currentPassword || !passwords.newPassword}>
                  Change Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="glass-card danger-card">
              <div className="section-title danger-title"><span>⚠️</span> Danger Zone</div>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                These actions are permanent and cannot be undone. Please be careful.
              </p>
              
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => alert('Feature coming soon!')}>
                  📦 Export My All Data
                </button>
                <button className="btn btn-ghost logout-btn" style={{ justifyContent: 'flex-start' }} onClick={logout}>
                  ↩ Sign Out of All Devices
                </button>
                <button className="btn btn-danger" style={{ background: '#EF4444', color: 'white', border: 'none', justifyContent: 'flex-start' }} onClick={() => alert('Please contact support.')}>
                  🗑️ Permanently Delete Account
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
