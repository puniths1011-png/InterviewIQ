import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { 
      const token = localStorage.getItem('iq_token');
      const userData = localStorage.getItem('iq_user');
      return (token && userData) ? JSON.parse(userData) : null;
    } catch { 
      return null; 
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('iq_token');
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.user))
        .catch(() => { localStorage.removeItem('iq_token'); localStorage.removeItem('iq_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    const res = await authAPI.login({ email, password });
    localStorage.setItem('iq_token', res.token);
    localStorage.setItem('iq_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    setError(null);
    const res = await authAPI.register(data);
    localStorage.setItem('iq_token', res.token);
    localStorage.setItem('iq_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('iq_token');
    localStorage.removeItem('iq_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('iq_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
