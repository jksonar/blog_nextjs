import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { FiCalendar, FiUser, FiTag, FiFolder } from 'react-icons/fi';
import { fetchBlogPostBySlug } from '@/utils/api';
import BlogInteractionBar from '@/components/BlogInteractionBar';
import CommentSection from '@/components/CommentSection';
import SocialShareButtons from '@/components/SocialShareButtons';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If fetching fails, let Next.js handle the notFound() for metadata
    throw new Error('Blog post not found for metadata');
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
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
              onError={(e) => {
                console.log('Image failed to load:', e.currentTarget.src);
              }}
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
          <SocialShareButtons title={post.title} />
        </header>
        
        {/* Post Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </article>
        
        {/* Blog Interaction Bar */}
        <div className="my-8">
          <BlogInteractionBar 
            slug={slug}
            likesCount={post.likes_count || 0}
            userHasLiked={post.user_has_liked || false}
            userRating={post.user_rating ?? null}
            averageRating={post.average_rating ?? null}
          />
        </div>
        
        {/* Comments Section */}
        <CommentSection slug={slug} />
        
        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <Link 
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </footer>
      </div>
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If fetching fails, throw an error to trigger Next.js's notFound() handling
    throw new Error('Blog post not found');
  }
}