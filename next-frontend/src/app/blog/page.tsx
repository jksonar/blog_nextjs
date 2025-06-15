import { Suspense } from 'react';
import { fetchBlogPosts, fetchCategories, fetchTags } from '@/utils/api';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import Link from 'next/link';

export const metadata = {
  title: 'Blog Posts - Blog Site',
  description: 'Browse all our blog posts',
};

interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Get filter parameters from URL
  const category = searchParams?.category;
  const tag = searchParams?.tag;
  const page = searchParams?.page || '1';
  const currentPage = parseInt(page, 10) || 1;
  
  // Fetch blog posts with filters
  const blogData = await fetchBlogPosts({ category, tag }).catch(() => ({ results: [], count: 0 }));
  const posts = blogData.results || [];
  const totalPosts = blogData.count || 0;
  
  // Fetch categories and tags for filters
  const categoriesData = await fetchCategories().catch(() => ({ results: [] }));
  const tagsData = await fetchTags().catch(() => ({ results: [] }));
  
  // Extract the results arrays
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData.results || []);
  const tags = Array.isArray(tagsData) ? tagsData : (tagsData.results || []);
  
  // Calculate pagination
  const postsPerPage = 9;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {category ? `Posts in ${category}` : 
           tag ? `Posts tagged with ${tag}` : 
           'All Blog Posts'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/blog"
              className={`px-3 py-1 text-sm rounded-full ${!category ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`px-3 py-1 text-sm rounded-full ${category === cat.slug ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <Link 
              href={category ? `/blog?category=${category}` : '/blog'}
              className={`px-3 py-1 text-sm rounded-full ${!tag ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}
            >
              All
            </Link>
            {tags.map((t) => (
              <Link 
                key={t.id}
                href={category ? `/blog?category=${category}&tag=${t.slug}` : `/blog?tag=${t.slug}`}
                className={`px-3 py-1 text-sm rounded-full ${tag === t.slug ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Blog Posts Grid */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try changing your filters or check back later.
            </p>
            <Link 
              href="/blog"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View All Posts
            </Link>
          </div>
        )}
      </Suspense>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pageNum === currentPage;
              const pageUrl = new URLSearchParams(searchParams);
              pageUrl.set('page', pageNum.toString());
              
              return (
                <Link
                  key={pageNum}
                  href={`/blog?${pageUrl.toString()}`}
                  className={`px-4 py-2 text-sm rounded-md ${isCurrentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}