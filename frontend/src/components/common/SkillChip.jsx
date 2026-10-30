import React from 'react';

/**
 * Reusable SkillChip component
 * @param {string} skill - The skill name
 * @param {'matched' | 'missing' | 'neutral'} variant - Style variant
 * @param {boolean} showPrefix - If true, adds '+ ' for missing skills
 * @param {function} onClick - Optional click handler
 * @param {string} className - Optional extra class names
 */
export const SkillChip = ({
  skill,
  variant = 'neutral',
  showPrefix = true,
  onClick,
  className = '',
}) => {
  let variantStyles = '';

  switch (variant) {
    case 'matched':
      // Green border, emerald glow, matches screenshot 1
      variantStyles =
        'border border-emerald-500/80 bg-[#07302c] text-emerald-300 font-medium shadow-sm hover:border-emerald-400';
      break;

    case 'missing':
      // Dashed orange border, amber dark bg, matches screenshot 1
      variantStyles =
        'border-2 border-dashed border-orange-500/80 bg-[#351a1a]/70 text-orange-300 font-medium hover:border-orange-400';
      break;

    case 'neutral':
    default:
      // Dark navy pill, subtle slate border, matches screenshot 1
      variantStyles =
        'border border-[#203666] bg-[#14254b] text-slate-200 hover:border-slate-500/60';
      break;
  }

  const prefix = variant === 'missing' && showPrefix ? '+ ' : '';

  return (
    <span
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={`inline-flex items-center justify-center h-7 px-3.5 rounded-full text-xs sm:text-sm leading-none transition-all duration-150 select-none box-border ${variantStyles} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {prefix}
      <span>{skill}</span>
    </span>
  );
};

export default SkillChip;
