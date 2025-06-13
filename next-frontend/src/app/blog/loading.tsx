export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="h-8 bg-gray-200 w-1/4 mb-8 rounded animate-pulse"></div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar skeleton */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="h-6 bg-gray-200 w-1/2 mb-4 rounded animate-pulse"></div>
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 w-1/2 mb-4 rounded animate-pulse"></div>
            <div className="flex flex-wrap gap-2 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="h-8 w-16 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="w-full md:w-3/4">
          <div className="space-y-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md p-6 animate-pulse">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 bg-gray-200 mb-4 md:mb-0 md:mr-6 rounded"></div>
                  <div className="md:w-2/3">
                    <div className="h-4 bg-gray-200 w-1/4 mb-2 rounded"></div>
                    <div className="h-6 bg-gray-200 w-3/4 mb-4 rounded"></div>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3].map((tag) => (
                        <div key={tag} className="h-6 w-12 bg-gray-200 rounded-full"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}