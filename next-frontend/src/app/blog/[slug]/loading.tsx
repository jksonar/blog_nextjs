export default function BlogPostLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured Image placeholder */}
      <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      
      {/* Post Header placeholder */}
      <header className="mb-8">
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        {/* Tags placeholder */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        
        {/* Social Share placeholder */}
        <div className="flex items-center space-x-4">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
      
      {/* Post Content placeholder */}
      <article className="space-y-4">
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </article>
    </div>
  );
}