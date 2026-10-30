import api, { setAccessToken, clearAccessToken } from './api';
import { initialAdminUsers } from './mockData';

export const authService = {
  // Login method supporting FastAPI /login and offline fallback
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user } = response.data;
      if (access_token) {
        setAccessToken(access_token);
      }
      return { user, token: access_token };
    } catch (err) {
      // If backend is offline or mock requested, simulate authentication
      console.warn('Backend unavailable, using simulated authentication:', err.message);
      
      const foundUser = initialAdminUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || {
        id: 'u-user',
        name: email.split('@')[0],
        email: email,
        role: email.includes('recruiter') ? 'recruiter' : email.includes('admin') ? 'admin' : 'student',
        status: 'Active',
      };

      const mockToken = `mock-jwt-${Date.now()}-${foundUser.role}`;
      setAccessToken(mockToken);
      return { user: foundUser, token: mockToken };
    }
  },

  // Register method supporting FastAPI /register
  async register({ name, email, password, role = 'student' }) {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        role,
      });
      const { access_token, user } = response.data;
      if (access_token) {
        setAccessToken(access_token);
      }
      return { user, token: access_token };
    } catch (err) {
      console.warn('Backend unavailable, simulated register:', err.message);
      const newUser = {
        id: `u-${Date.now()}`,
        name,
        email,
        role,
        status: 'Active',
      };
      const mockToken = `mock-jwt-${Date.now()}-${role}`;
      setAccessToken(mockToken);
      return { user: newUser, token: mockToken };
    }
  },

  // Refresh token method
  async refresh() {
    try {
      const response = await api.post('/refresh');
      const token = response.data?.access_token || response.data?.token;
      if (token) {
        setAccessToken(token);
      }
      return token;
    } catch (err) {
      clearAccessToken();
      throw err;
    }
  },

  // Logout method
  async logout() {
    try {
      await api.post('/logout');
    } catch (err) {
      // ignore
    } finally {
      clearAccessToken();
    }
  },
};
