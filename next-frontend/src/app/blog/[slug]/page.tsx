import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { FiCalendar, FiUser, FiTag, FiFolder, FiShare2 } from 'react-icons/fi';
import { fetchBlogPostBySlug } from '@/utils/api';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const post = await fetchBlogPostBySlug(slug);
    
    return {
      title: `${post.title} - Blog Site`,
      description: post.content?.substring(0, 160) || 'Read this blog post on our site',
      openGraph: {
        title: post.title,
        description: post.content?.substring(0, 160) || 'Read this blog post on our site',
        images: post.featured_image ? [
          {
            url: post.featured_image.startsWith('http') 
              ? post.featured_image 
              : `http://localhost:8000${post.featured_image}`,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found - Blog Site',
      description: 'The requested blog post could not be found',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  
  try {
    const post = await fetchBlogPostBySlug(slug);
    
    const formattedDate = post.created_at 
      ? format(new Date(post.created_at), 'MMMM dd, yyyy') 
      : '';
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image.startsWith('http') 
                ? post.featured_image 
                : `http://localhost:8000${post.featured_image}`}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4 mb-6">
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center">
              <FiUser className="mr-1" />
              <span>{post.author.first_name} {post.author.last_name}</span>
            </div>
            
            {post.category && (
              <Link 
                href={`/blog?category=${post.category.slug}`}
                className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
              >
                <FiFolder className="mr-1" />
                {post.category.name}
              </Link>
            )}
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link 
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <FiTag className="mr-1" />
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
          
          {/* Social Share */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <FiShare2 className="mr-1" /> Share:
            </span>
            <div className="flex space-x-2">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </header>
        
        {/* Post Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </article>
        
        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <Link 
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    notFound();
  }
}