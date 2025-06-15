import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogPosts } from '@/utils/api';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';

export default async function Home() {
  // Fetch featured blog posts for the homepage
  const blogData = await fetchBlogPosts().catch(() => ({ results: [], count: 0 }));
  const featuredPosts = blogData.results?.slice(0, 3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Our Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Discover the latest articles, tutorials, and insights on our modern blog platform.
        </p>
        <Link 
          href="/blog" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Explore All Posts
        </Link>
      </section>

      {/* Featured Posts Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Posts
          </h2>
          <Link 
            href="/blog" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            View All →
          </Link>
        </div>

        {featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
      </section>
    </div>
  );
}
