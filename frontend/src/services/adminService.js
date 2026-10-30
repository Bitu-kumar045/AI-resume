import api from './api';
import { initialAdminUsers, skillDemandAnalytics } from './mockData';

const getStoredUsers = () => {
  const stored = localStorage.getItem('resumefit_admin_users');
  return stored ? JSON.parse(stored) : initialAdminUsers;
};

const saveStoredUsers = (users) => {
  localStorage.setItem('resumefit_admin_users', JSON.stringify(users));
};

export const adminService = {
  // GET /admin/users
  async getUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (err) {
      console.warn('API /admin/users offline, using mock admin users');
      return getStoredUsers();
    }
  },

  // PUT /admin/users/:id
  async updateUserRole(id, role) {
    try {
      const response = await api.put(`/admin/users/${id}`, { role });
      return response.data;
    } catch (err) {
      const users = getStoredUsers();
      const updated = users.map((u) => (u.id === id ? { ...u, role } : u));
      saveStoredUsers(updated);
      return { success: true };
    }
  },

  // DELETE /admin/users/:id
  async deleteUser(id) {
    try {
      await api.delete(`/admin/users/${id}`);
      return true;
    } catch (err) {
      const users = getStoredUsers();
      const updated = users.filter((u) => u.id !== id);
      saveStoredUsers(updated);
      return true;
    }
  },

  // GET /admin/analytics/skills (demanded skills data for Recharts)
  async getSkillDemand() {
    try {
      const response = await api.get('/admin/analytics/skills');
      return response.data;
    } catch (err) {
      return skillDemandAnalytics;
    }
  },

  // GET /admin/overview
  async getOverviewStats() {
    try {
      const response = await api.get('/admin/overview');
      return response.data;
    } catch (err) {
      return {
        totalUsers: 248,
        activeJobs: 34,
        resumesParsed: 812,
        averageMatchRate: 72,
      };
    }
  },
};
