const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
      
      <div className="p-5">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        
        {/* Date and author placeholder */}
        <div className="flex items-center mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mr-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4 mx-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        
        {/* Tags placeholder */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
        </div>
        
        {/* Read more link placeholder */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;