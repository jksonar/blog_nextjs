import SkeletonCard from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
      </div>
      
      {/* Filters skeleton */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Blog Posts Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}