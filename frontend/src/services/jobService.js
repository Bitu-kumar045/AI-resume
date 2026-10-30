import api from './api';
import { initialJobs, initialCandidatesPerJob } from './mockData';

// Local storage cache for offline demo mutation support
const getStoredJobs = () => {
  const stored = localStorage.getItem('resumefit_jobs');
  return stored ? JSON.parse(stored) : initialJobs;
};

const saveStoredJobs = (jobs) => {
  localStorage.setItem('resumefit_jobs', JSON.stringify(jobs));
};

export const jobService = {
  // GET /jobs
  async getJobs() {
    try {
      const response = await api.get('/jobs');
      return response.data;
    } catch (err) {
      console.warn('API /jobs unreachable, returning mock jobs:', err.message);
      return getStoredJobs();
    }
  },

  // GET /jobs/:id
  async getJobById(id) {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (err) {
      const jobs = getStoredJobs();
      return jobs.find((j) => j.id === id) || null;
    }
  },

  // POST /jobs
  async createJob(jobData) {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (err) {
      console.warn('API create job offline, saving locally');
      const jobs = getStoredJobs();
      const newJob = {
        ...jobData,
        id: `job-${Date.now()}`,
        postedAt: new Date().toISOString(),
        applicantsCount: 0,
      };
      const updated = [newJob, ...jobs];
      saveStoredJobs(updated);
      return newJob;
    }
  },

  // PUT /jobs/:id
  async updateJob(id, jobData) {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (err) {
      const jobs = getStoredJobs();
      const updated = jobs.map((j) => (j.id === id ? { ...j, ...jobData } : j));
      saveStoredJobs(updated);
      return { id, ...jobData };
    }
  },

  // DELETE /jobs/:id
  async deleteJob(id) {
    try {
      await api.delete(`/jobs/${id}`);
      return true;
    } catch (err) {
      const jobs = getStoredJobs();
      const filtered = jobs.filter((j) => j.id !== id);
      saveStoredJobs(filtered);
      return true;
    }
  },

  // GET /jobs/:id/candidates
  async getJobCandidates(jobId) {
    try {
      const response = await api.get(`/jobs/${jobId}/candidates`);
      return response.data;
    } catch (err) {
      console.warn(`API /jobs/${jobId}/candidates unreachable, returning ranked mock candidates`);
      return initialCandidatesPerJob[jobId] || [
        {
          id: `cand-${Date.now()}`,
          name: 'Alex Mercer (You)',
          email: 'alex.mercer@example.com',
          matchScore: 65,
          resumeScore: 77,
          matchedSkills: ['Python', 'SQL'],
          missingSkills: ['Docker'],
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Under Review',
        },
      ];
    }
  },
};
