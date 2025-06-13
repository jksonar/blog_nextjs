'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchPosts, fetchCategories, fetchTags } from '@/services/api';
import { BlogPost, Category, Tag, BlogPostsResponse } from '@/types/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch posts with filters
        const params: Record<string, any> = { page };
        if (activeCategory) params.category = activeCategory;
        if (activeTag) params.tag = activeTag;
        
        const postsData: BlogPostsResponse = await fetchPosts(params);
        setPosts(postsData.results);
        setTotalPages(Math.ceil(postsData.count / 10)); // Assuming 10 items per page
        
        // Fetch categories and tags if not loaded yet
        if (categories.length === 0) {
          const categoriesData = await fetchCategories();
          setCategories(categoriesData.results);
        }
        
        if (tags.length === 0) {
          const tagsData = await fetchTags();
          setTags(tagsData.results);
        }
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [page, activeCategory, activeTag]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(activeCategory === slug ? null : slug);
    setActiveTag(null);
    setPage(1);
  };

  const handleTagClick = (slug: string) => {
    setActiveTag(activeTag === slug ? null : slug);
    setActiveCategory(null);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {loading && categories.length === 0 ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <button
                      onClick={() => handleCategoryClick(category.slug)}
                      className={`text-left w-full hover:text-blue-600 ${activeCategory === category.slug ? 'font-semibold text-blue-600' : ''}`}
                    >
                      {category.name}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {loading && tags.length === 0 ? (
                <div className="animate-pulse flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="h-8 w-16 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.slug)}
                    className={`px-3 py-1 rounded-full text-sm ${activeTag === tag.slug ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          {loading ? (
            // Loading skeleton
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 mb-4 rounded"></div>
                  <div className="h-6 bg-gray-200 w-1/4 mb-2 rounded"></div>
                  <div className="h-8 bg-gray-200 w-3/4 mb-4 rounded"></div>
                  <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-8">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                    <div className="md:flex">
                      {post.featured_image && (
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <Image 
                            src={post.featured_image} 
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6 md:w-2/3">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span>{post.category.name}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(post.publish_date || post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <div className="flex gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span key={tag.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                        <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${pageNum === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-gray-600 mb-4">
                {activeCategory || activeTag ? 
                  'No posts match the selected filters. Try changing your selection.' : 
                  'There are no blog posts available at the moment.'}
              </p>
              {(activeCategory || activeTag) && (
                <button 
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveTag(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}