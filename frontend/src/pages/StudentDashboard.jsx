import React, { useState, useEffect, useMemo } from 'react';
import { Search, Upload, CheckCircle, Sparkles, Filter, Check, Send } from 'lucide-react';
import SkillChip from '../components/common/SkillChip';
import MatchBar from '../components/common/MatchBar';
import JobCard from '../components/common/JobCard';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import ResumeUploadModal from '../components/student/ResumeUploadModal';
import { resumeService } from '../services/resumeService';
import { jobService } from '../services/jobService';

export const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, HIGH_MATCH, INTERN
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState({});

  // Initial data loading
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resumeData, jobsData] = await Promise.all([
          resumeService.getMyResume(),
          jobService.getJobs(),
        ]);
        setResume(resumeData);
        setJobs(jobsData);
        if (jobsData.length > 0) {
          setSelectedJob(jobsData[0]); // Default to first job (Backend intern)
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute matches and skill gaps
  const { matchesMap, matchedSkillsForSelected, missingSkillsForSelected } = useMemo(() => {
    if (!resume || !jobs.length) {
      return { matchesMap: {}, matchedSkillsForSelected: [], missingSkillsForSelected: [] };
    }

    const resumeSkills = resume.skills || [];
    const map = {};

    jobs.forEach((job) => {
      const required = job.requiredSkills || [];
      const matched = required.filter((s) =>
        resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase())
      );
      const missing = required.filter(
        (s) => !resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase())
      );

      const pct = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 0;
      map[job.id] = {
        pct,
        matched,
        missing,
      };
    });

    const currentSelectedId = selectedJob?.id || jobs[0]?.id;
    const selectedInfo = map[currentSelectedId] || { matched: [], missing: [] };

    return {
      matchesMap: map,
      matchedSkillsForSelected: selectedInfo.matched,
      missingSkillsForSelected: selectedInfo.missing,
    };
  }, [resume, jobs, selectedJob]);

  // Filtered jobs list based on search and filter pills
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.requiredSkills || []).some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      const matchInfo = matchesMap[job.id];
      if (filterType === 'HIGH_MATCH') {
        return (matchInfo?.pct || 0) >= 70;
      }
      if (filterType === 'INTERN') {
        return (
          job.type.toLowerCase().includes('intern') ||
          job.title.toLowerCase().includes('intern') ||
          job.title.toLowerCase().includes('trainee')
        );
      }

      return true;
    });
  }, [jobs, searchQuery, filterType, matchesMap]);

  const handleApply = () => {
    if (!selectedJob) return;
    setAppliedJobs((prev) => ({
      ...prev,
      [selectedJob.id]: true,
    }));
    setIsApplyModalOpen(false);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const hasAppliedToSelected = selectedJob && appliedJobs[selectedJob.id];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Hero Header matching Screenshot 1 */}
        <section className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            See how your resume fits each job
          </h1>
          <p className="mt-2.5 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Pick a job on the right. Skills you already have light up, and the dashed ones
            show what to learn next.
          </p>
        </section>

        {/* Two-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Resume Analysis Card */}
          <div className="lg:col-span-7 bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/20">
            {/* Resume File Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#182b54]">
              <div className="min-w-0">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight truncate block">
                  {resume?.filename || 'my_resume.pdf'}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Parsed via ResumeFit Engine • {resume?.skills?.length || 0} skills detected
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-[#132247] hover:bg-[#1b2f61] text-white text-sm font-semibold rounded-xl border border-[#2b4478] transition-all hover:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
              >
                Upload PDF
              </button>
            </div>

            {/* Skills found in your resume */}
            <div className="py-5 border-b border-[#182b54]">
              <h2 className="text-sm font-semibold text-slate-300 tracking-wide mb-3">
                Skills found in your resume
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {(resume?.skills || []).map((skill) => {
                  // If required by currently selected job, lights up green!
                  const isRequiredBySelectedJob = (
                    selectedJob?.requiredSkills || []
                  ).some((req) => req.toLowerCase() === skill.toLowerCase());

                  return (
                    <SkillChip
                      key={skill}
                      skill={skill}
                      variant={isRequiredBySelectedJob ? 'matched' : 'neutral'}
                    />
                  );
                })}
              </div>
            </div>

            {/* To match [Selected Job Title] */}
            <div className="py-5 border-b border-[#182b54]">
              <h2 className="text-sm font-semibold text-slate-300 tracking-wide mb-3">
                To match <span className="text-white font-bold">{selectedJob?.title || 'Selected Job'}</span>
              </h2>

              {missingSkillsForSelected.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {missingSkillsForSelected.map((skill) => (
                    <SkillChip
                      key={skill}
                      skill={skill}
                      variant="missing"
                      showPrefix={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Great job! You already match 100% of the required skills for this job.</span>
                </div>
              )}
            </div>

            {/* Resume Score & Progress Breakdown */}
            <div className="pt-5">
              <h2 className="text-sm font-semibold text-slate-300 tracking-wide mb-2">
                Resume score
              </h2>

              {/* Big Score Header */}
              <div className="flex items-baseline mb-5">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {resume?.overallScore || 77}
                </span>
                <span className="text-base text-slate-400 font-medium ml-2.5">
                  out of 100
                </span>
              </div>

              {/* Breakdown Bars matching Screenshot 1 */}
              <div className="space-y-1 mb-6">
                {(resume?.scoreBreakdown || []).map((item) => (
                  <MatchBar
                    key={item.category}
                    label={item.category}
                    value={item.score}
                    max={item.maxScore}
                  />
                ))}
              </div>

              {/* Tips & Recommendations matching Screenshot 1 */}
              <div className="pt-4 border-t border-[#182b54] space-y-2">
                {(resume?.tips || [
                  'Add numbers to your project lines, such as users reached or time saved.',
                  'Use words from the jobs you want, such as REST or Docker, where they are true.',
                ]).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="text-blue-400 shrink-0 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Jobs for you */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                Jobs for you
              </h2>

              {/* Search Bar matching Screenshot 2 */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, company or skill"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0c1730] border border-[#1e3463] text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Quick Filter Pills */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                    filterType === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#101d3b] text-slate-400 hover:text-white border border-[#1d3361]'
                  }`}
                >
                  All Jobs ({jobs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('HIGH_MATCH')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                    filterType === 'HIGH_MATCH'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#101d3b] text-slate-400 hover:text-white border border-[#1d3361]'
                  }`}
                >
                  High Match (&gt;70%)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('INTERN')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                    filterType === 'INTERN'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#101d3b] text-slate-400 hover:text-white border border-[#1d3361]'
                  }`}
                >
                  Internships
                </button>
              </div>
            </div>

            {/* Job Cards List */}
            {filteredJobs.length > 0 ? (
              <div className="space-y-3">
                {filteredJobs.map((job) => {
                  const match = matchesMap[job.id]?.pct || 0;
                  const isSelected = selectedJob?.id === job.id;

                  return (
                    <JobCard
                      key={job.id}
                      job={job}
                      matchPercentage={match}
                      isSelected={isSelected}
                      onSelect={(j) => setSelectedJob(j)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No jobs match your query"
                description="Try clearing your search query or choosing another filter."
                actionLabel="Reset Search"
                onAction={() => {
                  setSearchQuery('');
                  setFilterType('ALL');
                }}
              />
            )}

            {/* Apply Button matching Screenshot 2 */}
            {selectedJob && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(true)}
                  disabled={hasAppliedToSelected}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg ${
                    hasAppliedToSelected
                      ? 'bg-emerald-600 text-white cursor-default flex items-center justify-center gap-2'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:shadow-blue-500/40'
                  }`}
                >
                  {hasAppliedToSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Applied to {selectedJob.title}</span>
                    </>
                  ) : (
                    <span>Apply to {selectedJob.title}</span>
                  )}
                </button>
              </div>
            )}

            {/* Footnotes matching Screenshot 2 */}
            <div className="pt-4 text-xs text-slate-400 space-y-1">
              <p>
                Match is the share of required skills you have. The full app adds TF-IDF scoring on top.
              </p>
              <p>
                Sample data only. Nothing you type here is saved.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* PDF Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={(updatedResume) => {
          setResume(updatedResume);
        }}
      />

      {/* Application Confirmation Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply to ${selectedJob?.title || 'Job'}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            You are applying to <strong className="text-white">{selectedJob?.title}</strong> at{' '}
            <strong className="text-white">{selectedJob?.company}</strong> using your active resume{' '}
            <span className="text-blue-400 font-mono text-xs">({resume?.filename})</span>.
          </p>

          <div className="bg-[#0c1730] p-4 rounded-xl border border-[#1d325e] text-xs space-y-1 text-slate-300">
            <div>
              Match Score:{' '}
              <span className="text-white font-bold">{matchesMap[selectedJob?.id]?.pct || 0}%</span>
            </div>
            <div>
              Matched Skills:{' '}
              <span className="text-emerald-400">
                {(matchesMap[selectedJob?.id]?.matched || []).join(', ') || 'None'}
              </span>
            </div>
            <div>
              Skill Gaps:{' '}
              <span className="text-orange-400">
                {(matchesMap[selectedJob?.id]?.missing || []).join(', ') || 'None'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-[#142347] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
