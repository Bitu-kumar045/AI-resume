import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-[#17284f] rounded-lg relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
    {/* Left Skeleton */}
    <div className="lg:col-span-7 space-y-6 bg-[#0f1d3b] p-6 rounded-2xl border border-[#1e335f]">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-3 pt-4">
        <Skeleton className="h-10 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </div>

    {/* Right Skeleton */}
    <div className="lg:col-span-5 space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
