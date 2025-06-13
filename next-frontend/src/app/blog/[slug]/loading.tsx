export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-pulse">
      <div className="h-6 bg-gray-200 w-24 mb-6 rounded"></div>
      
      <div>
        <div className="h-10 bg-gray-200 w-3/4 mb-4 rounded"></div>
        <div className="h-6 bg-gray-200 w-1/3 mb-8 rounded"></div>
        
        <div className="h-96 bg-gray-200 mb-8 rounded"></div>
        
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 w-4/5 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
        </div>
        
        <div className="mt-8 pt-6">
          <div className="h-6 bg-gray-200 w-1/6 mb-4 rounded"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map(tag => (
              <div key={tag} className="h-8 w-16 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8">
        <div className="h-8 bg-gray-200 w-1/4 mb-6 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(post => (
            <div key={post} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}