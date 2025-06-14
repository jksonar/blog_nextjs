'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import { fetchPostBySlug, fetchRelatedPosts } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const slug = params?.slug as string;

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!slug) return;
        
        const postData = await fetchPostBySlug(slug);
        setPost(postData);
        
        // Fetch related posts based on category
        if (postData?.category) {
          const related = await fetchRelatedPosts(postData.id, postData.category.id);
          setRelatedPosts(related);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-100 min-h-screen py-12">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-8">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                    <div className="flex gap-4 mb-6">
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 space-y-8">
                <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-100 min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center py-12 bg-white rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "We couldn&apos;t find the post you&apos;re looking for."}</p>
              <Link href="/blog" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition duration-150">
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12">
        {/* Hero Section with Featured Image */}
        <div className="bg-dark text-white py-16 relative">
          {post.featured_image && (
            <div className="absolute inset-0 bg-black/60 z-0">
              {/* Background image would be here with overlay */}
            </div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-4">
                <Link 
                  href={`/blog?category=${post.category.name}`}
                  className="inline-block bg-primary-600 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-primary-700 transition duration-150"
                >
                  {post.category.name}
                </Link>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-center text-sm text-gray-300 mb-4">
                <span>{new Date(post.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="mx-2">•</span>
                <span>By {post.author}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full lg:w-2/3 order-2 lg:order-1">
              {/* Featured Image (if not using as hero background) */}
              {post.featured_image && (
                <div className="rounded-lg overflow-hidden mb-8 bg-white p-2 shadow-sm">
                  <div className="bg-gray-200 h-96 rounded-lg relative">
                    {/* Image would be here */}
                  </div>
                </div>
              )}

              {/* Post Content */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link 
                        key={tag.id} 
                        href={`/blog?tag=${tag.name}`}
                        className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition duration-150"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Bio (Mobile) */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 lg:hidden">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-300"></div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-800">{post.author}</h3>
                    <p className="text-sm text-gray-500">Content Writer</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-600 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Leave a Comment</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea 
                      id="comment" 
                      rows={5} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition duration-150"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 space-y-6 order-1 lg:order-2">
              {/* Author Bio (Desktop) */}
              <div className="bg-white rounded-lg shadow-sm p-6 hidden lg:block">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-300"></div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">{post.author}</h4>
                    <p className="text-sm text-gray-500">Content Writer</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-600 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Related Posts</h3>
                {relatedPosts.length > 0 ? (
                  <ul className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <li key={relatedPost.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <Link href={`/blog/${relatedPost.slug}`} className="group">
                          <h4 className="font-medium text-gray-800 group-hover:text-primary-600 transition duration-150 mb-1">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(relatedPost.published_date).toLocaleDateString()}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No related posts found.</p>
                )}
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