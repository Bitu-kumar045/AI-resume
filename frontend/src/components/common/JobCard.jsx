import React from 'react';

/**
 * Reusable JobCard component
 * @param {object} job - Job data
 * @param {number} matchPercentage - Calculated match score (0-100)
 * @param {boolean} isSelected - Whether this job is currently selected
 * @param {function} onSelect - Selection click handler
 */
export const JobCard = ({
  job,
  matchPercentage = 0,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  const skillsDisplay = (job.requiredSkills || []).join(', ');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect && onSelect(job)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(job);
        }
      }}
      aria-pressed={isSelected}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 cursor-pointer select-none outline-none ${
        isSelected
          ? 'border-2 border-blue-500 bg-[#101f42] shadow-lg shadow-blue-500/10'
          : 'border border-[#1e3463] bg-[#0c1730] hover:border-[#2b4c8f] hover:bg-[#0f1d3e]'
      } focus-visible:ring-2 focus-visible:ring-blue-400 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Column: Title, Company, Skills */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white tracking-tight truncate">
            {job.title}
          </h3>
          <p className="text-sm text-slate-400 font-normal mt-0.5 truncate">
            {job.company}
          </p>
          <p className="text-xs text-blue-200/75 mt-1.5 truncate">
            {skillsDisplay}
          </p>
        </div>

        {/* Right Column: Match Score Percentage */}
        <div className="shrink-0 text-right">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {matchPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
