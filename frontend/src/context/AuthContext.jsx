import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { setAccessToken, clearAccessToken, getAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Store user info in localStorage for session persistence across refreshes,
  // while keeping the actual access token strictly in-memory per security guidelines.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('resumefit_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'u-1',
            name: 'Alex Mercer',
            email: 'alex.mercer@example.com',
            role: 'student',
          };
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => getAccessToken() || 'demo-jwt-student-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync in-memory token on initial load
    if (token) {
      setAccessToken(token);
    }

    // Listen for session expiration events from Axios interceptor
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session_expired', handleSessionExpired);
    };
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('resumefit_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('resumefit_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAccessToken();
      setUser(null);
      setToken(null);
      localStorage.removeItem('resumefit_user');
    }
  };

  // Switch active role instantly (useful for testing recruiter, student, admin views)
  const switchRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('resumefit_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
