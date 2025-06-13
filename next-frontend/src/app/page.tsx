import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the latest articles, insights, and stories from our team.
        </p>
        <div className="mt-8">
          <Link 
            href="/blog" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
          >
            Explore Blog
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-12 rounded-lg">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* This would be replaced with actual data from the API */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">Category • 5 min read</div>
                  <h3 className="text-xl font-semibold mb-2">Sample Blog Post Title</h3>
                  <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                  <Link href="/blog/sample-post" className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8">Stay updated with our latest articles and news.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
