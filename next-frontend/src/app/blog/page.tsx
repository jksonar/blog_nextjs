import { Suspense } from 'react';
import { fetchBlogPosts, fetchCategories, fetchTags } from '@/utils/api';
import BlogCard from '@/components/BlogCard';
import SkeletonCard from '@/components/SkeletonCard';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export const metadata = {
  title: 'Blog Posts - Blog Site',
  description: 'Browse all our blog posts',
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Fetch blog posts without filters initially
  const blogData = await fetchBlogPosts({}).catch(() => ({ results: [], count: 0 }));
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
  
  // Properly await searchParams before accessing its properties
  const params = await searchParams;
  const pageParam = params?.page;
  const currentPage = pageParam ? parseInt(pageParam as string, 10) : 1;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          All Blog Posts
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Browse all our articles and tutorials
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white`}
          >
            All Posts
          </Link>
          
          {/* Category filters */}
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              href={`/blog?category=${encodeURIComponent(cat.name)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              {cat.name}
            </Link>
          ))}
          
          {/* Tag filters */}
          {tags.map((t) => (
            <Link 
              key={t.id}
              href={`/blog?tag=${encodeURIComponent(t.name)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              #{t.name}
            </Link>
          ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                No posts found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There are no blog posts available at the moment.
              </p>
            </div>
          )}
        </div>
      </Suspense>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      )}
    </div>
  );
}