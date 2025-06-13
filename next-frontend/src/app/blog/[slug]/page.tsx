'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPostBySlug, fetchPosts } from '@/services/api';
import { BlogPost } from '@/types/blog';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const postData = await fetchPostBySlug(params.slug);
        setPost(postData);
        
        // Fetch related posts from the same category
        if (postData.category) {
          const relatedData = await fetchPosts({ 
            category: postData.category.slug,
            page_size: 3 // Limit to 3 related posts
          });
          // Filter out the current post
          setRelatedPosts(relatedData.results.filter(p => p.id !== postData.id));
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load the blog post. It may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-pulse">
        <div className="h-8 bg-gray-200 w-3/4 mb-4 rounded"></div>
        <div className="h-6 bg-gray-200 w-1/4 mb-8 rounded"></div>
        <div className="h-96 bg-gray-200 mb-8 rounded"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mb-6">
        ← Back to Blog
      </Link>
      
      <article>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-4">
            <div className="flex items-center">
              <span className="font-medium">{post.author.first_name} {post.author.last_name}</span>
            </div>
            <div className="flex items-center">
              <span>{new Date(post.publish_date || post.created_at).toLocaleDateString()}</span>
            </div>
            {post.category && (
              <Link 
                href={`/blog?category=${post.category.slug}`}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {post.category.name}
              </Link>
            )}
          </div>
          
          {post.featured_image && (
            <div className="relative h-96 w-full mb-8">
              <Image 
                src={post.featured_image} 
                alt={post.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
        </header>
        
        <div className="prose prose-lg max-w-none">
          {/* Render the content - in a real app, you might use a markdown renderer */}
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link 
                  key={tag.id} 
                  href={`/blog?tag=${tag.slug}`}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      
      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <div key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                {relatedPost.featured_image && (
                  <div className="h-48 relative">
                    <Image 
                      src={relatedPost.featured_image} 
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{relatedPost.title}</h3>
                  <Link 
                    href={`/blog/${relatedPost.slug}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}