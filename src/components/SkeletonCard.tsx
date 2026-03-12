"use client";

interface SkeletonCardProps {
  compact?: boolean;
}

export default function SkeletonCard({ compact = false }: SkeletonCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card h-full flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className={`${compact ? "h-44" : "h-56"} bg-gray-200 dark:bg-gray-700 relative`}>
        {/* Category badge skeleton */}
        <div className="absolute top-4 right-4 w-24 h-7 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className={`${compact ? "p-4" : "p-6"} flex-1 flex flex-col`}>
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2" />
        {!compact && (
          <>
            {/* Description */}
            <div className="space-y-2 mb-4 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </>
        )}

        {/* Rating skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Meta info skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-16 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Tags skeleton */}
        {!compact && (
          <div className="flex gap-2">
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="w-14 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        )}

        {/* Author skeleton */}
        {!compact && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        )}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
