import React from 'react';
import { ExternalLink } from 'lucide-react';

// Curated high-quality free learning guides for tech skills
const SKILL_GUIDES = {
  docker: 'https://docs.docker.com/get-started/',
  fastapi: 'https://fastapi.tiangolo.com/tutorial/',
  sql: 'https://www.w3schools.com/sql/',
  python: 'https://docs.python.org/3/tutorial/',
  react: 'https://react.dev/learn',
  javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  typescript: 'https://www.typescriptlang.org/docs/handbook/intro.html',
  git: 'https://git-scm.com/doc',
  pandas: 'https://pandas.pydata.org/docs/getting_started/index.html',
  matplotlib: 'https://matplotlib.org/stable/tutorials/index.html',
  rest: 'https://restfulapi.net/',
  graphql: 'https://graphql.org/learn/',
  kubernetes: 'https://kubernetes.io/docs/tutorials/',
  aws: 'https://aws.amazon.com/getting-started/',
  tailwindcss: 'https://tailwindcss.com/docs',
  tailwind: 'https://tailwindcss.com/docs',
  nextjs: 'https://nextjs.org/learn',
  nodejs: 'https://nodejs.org/en/learn',
  java: 'https://dev.java/learn/',
  html: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  css: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
};

export const getSkillGuideUrl = (skill) => {
  const normalized = (skill || '').trim().toLowerCase();
  return SKILL_GUIDES[normalized] || `https://roadmap.sh/search?q=${encodeURIComponent(skill)}`;
};

/**
 * Reusable SkillChip component
 * @param {string} skill - The skill name
 * @param {'matched' | 'missing' | 'neutral'} variant - Style variant
 * @param {boolean} showPrefix - If true, adds '+ ' for missing skills
 * @param {boolean} openGuideOnMissing - If true, missing skill opens a learning guide in new tab
 * @param {function} onClick - Optional click handler
 * @param {string} className - Optional extra class names
 */
export const SkillChip = ({
  skill,
  variant = 'neutral',
  showPrefix = true,
  openGuideOnMissing = true,
  onClick,
  className = '',
}) => {
  let variantStyles = '';

  switch (variant) {
    case 'matched':
      // Green border, emerald glow
      variantStyles =
        'border border-emerald-500/80 bg-[#07302c] text-emerald-300 font-medium shadow-sm hover:border-emerald-400';
      break;

    case 'missing':
      // Dashed orange border, amber dark bg with subtle interactive hover
      variantStyles =
        'border-2 border-dashed border-orange-500/80 bg-[#351a1a]/70 text-orange-300 font-medium hover:border-orange-400 hover:bg-[#431f1f]/80 hover:text-orange-200 cursor-pointer group shadow-sm';
      break;

    case 'neutral':
    default:
      // Dark navy pill, subtle slate border
      variantStyles =
        'border border-[#203666] bg-[#14254b] text-slate-200 hover:border-slate-500/60';
      break;
  }

  const prefix = variant === 'missing' && showPrefix ? '+ ' : '';
  const isMissing = variant === 'missing';
  const guideUrl = isMissing && openGuideOnMissing ? getSkillGuideUrl(skill) : null;

  // If it's a missing skill and guideUrl is active without a custom onClick, render an interactive anchor
  if (isMissing && guideUrl && !onClick) {
    return (
      <a
        href={guideUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Learn ${skill} (opens free guide in a new tab)`}
        className={`inline-flex items-center justify-center gap-1.5 h-7 px-3 rounded-full text-xs sm:text-sm leading-none transition-all duration-150 select-none box-border no-underline ${variantStyles} ${className}`}
      >
        <span>{prefix}{skill}</span>
        <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
      </a>
    );
  }

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
