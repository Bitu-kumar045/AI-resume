import React from 'react';

/**
 * Reusable MatchBar component for category score breakdown
 * @param {string} label - Category label (e.g. 'Contact details', 'Skills')
 * @param {number} value - Current score
 * @param {number} max - Maximum possible score
 * @param {string} barColor - Optional custom color
 */
export const MatchBar = ({
  label,
  value,
  max = 100,
  barColor = 'bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400',
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={`flex items-center justify-between gap-4 py-1.5 ${className}`}>
      {/* Category Name */}
      <span className="w-32 sm:w-36 text-sm text-slate-300 font-normal shrink-0">
        {label}
      </span>

      {/* Progress Track and Fill */}
      <div
        className="flex-1 h-2.5 bg-[#17274b] rounded-full overflow-hidden relative"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label} score`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Score Ratio (e.g. 10/10, 22/30) */}
      <span className="w-14 text-right text-sm text-slate-400 font-mono shrink-0">
        <span className="text-slate-200 font-medium">{value}</span>/{max}
      </span>
    </div>
  );
};

export default MatchBar;
