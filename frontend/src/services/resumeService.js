import api from './api';
import { initialResumeData, initialJobs } from './mockData';

const getStoredResume = () => {
  const stored = localStorage.getItem('resumefit_resume');
  return stored ? JSON.parse(stored) : initialResumeData;
};

const saveStoredResume = (data) => {
  localStorage.setItem('resumefit_resume', JSON.stringify(data));
};

export const resumeService = {
  // GET /resumes (fetch current candidate resume)
  async getMyResume() {
    try {
      const response = await api.get('/resumes');
      return response.data;
    } catch (err) {
      console.warn('API /resumes unreachable, using mock resume');
      return getStoredResume();
    }
  },

  // POST /resumes (upload PDF with multipart/form-data)
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      console.warn('API upload offline, simulating parsing of:', file.name);
      
      // Simulate real parsed skills from newly uploaded resume
      const current = getStoredResume();
      const updated = {
        ...current,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        overallScore: Math.floor(Math.random() * 15) + 75, // 75 - 90
      };
      saveStoredResume(updated);
      return updated;
    }
  },

  // GET /matches/me (get match percentage, breakdown, and gap analysis for current candidate)
  async getMatchesMe(resumeSkills = null) {
    try {
      const response = await api.get('/matches/me');
      return response.data;
    } catch (err) {
      console.warn('API /matches/me unreachable, computing client-side matches');
      
      const resume = getStoredResume();
      const skills = resumeSkills || resume.skills || [];
      const jobs = JSON.parse(localStorage.getItem('resumefit_jobs')) || initialJobs;

      // Compute exact match % and skill gaps
      const matches = jobs.map((job) => {
        const required = job.requiredSkills || [];
        const matched = required.filter((s) =>
          skills.some((rs) => rs.toLowerCase() === s.toLowerCase())
        );
        const missing = required.filter(
          (s) => !skills.some((rs) => rs.toLowerCase() === s.toLowerCase())
        );

        // Share of required skills matching (e.g. 3 of 5 is 60%)
        const baseShare = required.length > 0 ? (matched.length / required.length) * 100 : 0;
        const matchPercentage = Math.round(baseShare);

        return {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          matchPercentage,
          matchedSkills: matched,
          missingSkills: missing,
          requiredSkills: required,
        };
      });

      return {
        resume,
        matches,
      };
    }
  },
};
