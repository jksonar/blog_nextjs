'use client';

import { useState, useEffect } from 'react';
import { BlogPost, Category, Tag } from '@/types/blog';
import { fetchPosts, fetchCategories, fetchTags } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const postsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData, tagsData] = await Promise.all([
          fetchPosts(),
          fetchCategories(),
          fetchTags()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
        setTags(tagsData);
        setTotalPages(Math.ceil(postsData.length / postsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter posts based on selected category and tag
  const filteredPosts = posts
    .filter(post => !selectedCategory || post.category.name === selectedCategory)
    .filter(post => !selectedTag || post.tags.some(tag => tag.name === selectedTag));

  // Paginate posts
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen pb-12">
        {/* Hero Section */}
        <div className="bg-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the latest insights, stories, and ideas from our community of writers across various topics.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full lg:w-2/3 order-2 lg:order-1">
              {/* View Mode Toggle & Filters */}
              <div className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div>
                  {selectedCategory && (
                    <div className="text-lg mb-2">
                      Showing posts in <span className="font-semibold text-primary-600">{selectedCategory}</span>
                      <button 
                        onClick={() => setSelectedCategory(null)} 
                        className="ml-2 text-sm text-gray-500 hover:text-primary-600"
                      >
                        (Clear)
                      </button>
                    </div>
                  )}
                  {selectedTag && (
                    <div className="text-lg mb-2">
                      Showing posts tagged <span className="font-semibold text-primary-600">{selectedTag}</span>
                      <button 
                        onClick={() => setSelectedTag(null)} 
                        className="ml-2 text-sm text-gray-500 hover:text-primary-600"
                      >
                        (Clear)
                      </button>
                    </div>
                  )}
                  {!selectedCategory && !selectedTag && (
                    <div className="text-lg font-medium text-gray-700">All Posts</div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">View:</span>
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    aria-label="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {loading ? (
                // Loading skeleton
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginatedPosts.length > 0 ? (
                <>
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                    {paginatedPosts.map((post) => (
                      <BlogCard 
                        key={post.id}
                        post={post}
                        variant={viewMode}
                        onCategoryClick={() => setSelectedCategory(post.category.name)}
                        onTagClick={(tagName) => setSelectedTag(tagName)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Posts Found</h3>
                  <p className="text-gray-600 mb-6">We couldn&apos;t find any posts matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTag(null);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition duration-150"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 space-y-6 order-1 lg:order-2">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Search</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Categories</h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left flex items-center transition duration-150 ${!selectedCategory ? 'text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600'}`}
                    >
                      <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      All Categories
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button 
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left flex items-center transition duration-150 ${selectedCategory === category.name ? 'text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600'}`}
                      >
                        <span className="mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1.5 rounded-full text-sm transition duration-150 ${!selectedTag ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    All
                  </button>
                  {tags.map((tag) => (
                    <button 
                      key={tag.id}
                      onClick={() => setSelectedTag(tag.name)}
                      className={`px-3 py-1.5 rounded-full text-sm transition duration-150 ${selectedTag === tag.name ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Subscribe to Newsletter</h3>
                <p className="text-white/90 mb-4">Get the latest articles and news delivered to your inbox.</p>
                <form className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800"
                    required
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition duration-150"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}