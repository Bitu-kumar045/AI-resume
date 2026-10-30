import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Trash2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import SkillChip from '../components/common/SkillChip';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { jobService } from '../services/jobService';

export const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: 'Northwind Labs',
    location: 'Remote',
    type: 'Full-time',
    salary: '',
    requiredSkillsText: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Filter state for candidates
  const [candidateFilter, setCandidateFilter] = useState('ALL');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs();
      setJobs(data);
      if (data.length > 0) {
        setSelectedJob(data[0]);
        loadCandidates(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async (jobId) => {
    setCandidatesLoading(true);
    try {
      const data = await jobService.getJobCandidates(jobId);
      // Sort candidates by matchScore descending
      const sorted = [...data].sort((a, b) => b.matchScore - a.matchScore);
      setCandidates(sorted);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    loadCandidates(job.id);
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      company: 'Northwind Labs',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000 - $110,000',
      requiredSkillsText: '',
      description: '',
    });
    setFormErrors({});
    setIsJobModalOpen(true);
  };

  const openEditModal = (job, e) => {
    e.stopPropagation();
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary || '',
      requiredSkillsText: (job.requiredSkills || []).join(', '),
      description: job.description || '',
    });
    setFormErrors({});
    setIsJobModalOpen(true);
  };

  const handleDeleteJob = async (jobId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      await jobService.deleteJob(jobId);
      const remaining = jobs.filter((j) => j.id !== jobId);
      setJobs(remaining);
      if (selectedJob?.id === jobId) {
        const next = remaining[0] || null;
        setSelectedJob(next);
        if (next) loadCandidates(next.id);
      }
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Job title is required';
    if (!formData.company.trim()) errors.company = 'Company name is required';
    if (!formData.requiredSkillsText.trim())
      errors.requiredSkillsText = 'Specify at least 1 required skill';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const skillsArray = formData.requiredSkillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      type: formData.type,
      salary: formData.salary.trim(),
      requiredSkills: skillsArray,
      description: formData.description.trim(),
    };

    if (editingJob) {
      const updated = await jobService.updateJob(editingJob.id, payload);
      setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? { ...j, ...updated } : j)));
      if (selectedJob?.id === editingJob.id) {
        setSelectedJob((prev) => ({ ...prev, ...updated }));
      }
    } else {
      const created = await jobService.createJob(payload);
      setJobs((prev) => [created, ...prev]);
      setSelectedJob(created);
      loadCandidates(created.id);
    }

    setIsJobModalOpen(false);
  };

  const filteredCandidates = candidates.filter((cand) => {
    if (candidateFilter === 'HIGH_MATCH') return cand.matchScore >= 75;
    if (candidateFilter === 'SHORTLISTED') return cand.status === 'Shortlisted';
    return true;
  });

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Recruiter Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage postings, review incoming applicants, and analyze candidate skill fit.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>

        {/* Main Grid: Posted Jobs (Left) & Ranked Candidates (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Jobs Posted */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Your Active Jobs ({jobs.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-[#0f1d3b] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                title="No jobs posted yet"
                description="Click 'Post New Job' to publish your first role."
                actionLabel="Create Job"
                onAction={openCreateModal}
              />
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() => handleSelectJob(job)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border select-none ${
                        isSelected
                          ? 'border-2 border-blue-500 bg-[#101f42] shadow-lg shadow-blue-500/10'
                          : 'border border-[#1e3463] bg-[#0c1730] hover:border-[#2b4c8f] hover:bg-[#0f1d3e]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-white text-base tracking-tight truncate">{job.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 truncate">
                            {job.company} • {job.location} ({job.type})
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0 -mr-1 -mt-0.5">
                          <button
                            type="button"
                            onClick={(e) => openEditModal(job, e)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#182952] transition-colors"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteJob(job.id, e)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(job.requiredSkills || []).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 bg-[#14234b] text-blue-200 border border-[#203666] rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Ranked Candidates for Selected Job */}
          <div className="lg:col-span-7 bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            {selectedJob ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#182b54]">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Ranked Candidates for {selectedJob.title}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sorted by matching skill share & resume fit score.
                    </p>
                  </div>

                  {/* Candidate Filter */}
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCandidateFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        candidateFilter === 'ALL'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#14244b] text-slate-300 border border-[#1f3769] hover:text-white'
                      }`}
                    >
                      All ({candidates.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCandidateFilter('HIGH_MATCH')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        candidateFilter === 'HIGH_MATCH'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#14244b] text-slate-300 border border-[#1f3769] hover:text-white'
                      }`}
                    >
                      High Match (&gt;75%)
                    </button>
                  </div>
                </div>

                {candidatesLoading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filteredCandidates.length === 0 ? (
                  <EmptyState
                    title="No applicants yet"
                    description="When candidates submit resumes against this job, their ranked skill fit will show here."
                  />
                ) : (
                  <div className="space-y-3 mt-4">
                    {filteredCandidates.map((cand, idx) => (
                      <div
                        key={cand.id}
                        className="p-4 sm:p-4.5 rounded-xl border border-[#1e3463] bg-[#0c1730] hover:border-[#2b4c8f] transition-all space-y-3 shadow-sm"
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="px-2.5 py-1 rounded-lg bg-[#14244d] text-blue-300 text-xs font-bold border border-[#21386d] shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-white text-base tracking-tight truncate">
                                {cand.name}
                              </h3>
                              <p className="text-xs text-slate-400 truncate mt-0.5">{cand.email}</p>
                            </div>
                          </div>

                          {/* Match Percentage & Resume Score */}
                          <div className="text-right shrink-0">
                            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                              {cand.matchScore}%
                              <span className="text-xs font-normal text-slate-400 ml-1">
                                match
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 block mt-1">
                              Resume Score: <strong className="text-slate-200">{cand.resumeScore}/100</strong>
                            </span>
                          </div>
                        </div>

                        {/* Matched & Skill Gaps Display */}
                        <div className="bg-[#081124] p-3.5 rounded-xl border border-[#182952] space-y-2.5">
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                            <span className="text-xs text-emerald-400 font-semibold w-28 shrink-0 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                              Matched Skills:
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              {cand.matchedSkills.length > 0 ? (
                                cand.matchedSkills.map((s) => (
                                  <SkillChip key={s} skill={s} variant="matched" />
                                ))
                              ) : (
                                <span className="text-xs text-slate-500 italic">None</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                            <span className="text-xs text-orange-400 font-semibold w-28 shrink-0 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                              Skill Gaps:
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              {cand.missingSkills.length > 0 ? (
                                cand.missingSkills.map((s) => (
                                  <SkillChip
                                    key={s}
                                    skill={s}
                                    variant="missing"
                                    showPrefix={true}
                                  />
                                ))
                              ) : (
                                <span className="text-xs text-emerald-400 font-medium">
                                  ✓ No skill gaps!
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="Select a job"
                description="Choose a job from the left to view ranked candidates."
              />
            )}
          </div>
        </div>
      </div>

      {/* Post / Edit Job Modal */}
      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        title={editingJob ? 'Edit Job Posting' : 'Post New Job'}
      >
        <form onSubmit={handleJobSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Backend intern"
              className="w-full px-3.5 py-2 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.title && (
              <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.company && (
                <p className="text-red-400 text-xs mt-1">{formErrors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Trainee">Trainee</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Required Skills (comma-separated) *
            </label>
            <input
              type="text"
              value={formData.requiredSkillsText}
              onChange={(e) =>
                setFormData({ ...formData, requiredSkillsText: e.target.value })
              }
              placeholder="e.g. Python, SQL, Docker, FastAPI, Git"
              className="w-full px-3.5 py-2 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.requiredSkillsText && (
              <p className="text-red-400 text-xs mt-1">
                {formErrors.requiredSkillsText}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Separate skills with commas. Candidates will be ranked by matching these skills.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Key responsibilities and qualifications..."
              className="w-full px-3.5 py-2 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsJobModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-[#142347] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30"
            >
              {editingJob ? 'Save Changes' : 'Publish Job'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterDashboard;
