import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'grid' | 'list';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'grid' }) => {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 ${variant === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col'}`}>
      {/* Featured Image */}
      <div className={`relative ${variant === 'list' ? 'md:w-1/3 h-48 md:h-auto' : 'h-48'}`}>
        {post.featured_image ? (
          <div className="relative h-full w-full">
            <Image 
              src={post.featured_image} 
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {post.category.name}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className={`p-5 flex flex-col ${variant === 'list' ? 'md:w-2/3' : 'flex-grow'}`}>
        <div className="flex items-center text-xs text-gray-500 mb-2.5 gap-3">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.created_at)}
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author.first_name} {post.author.last_name}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors duration-200">
            {post.title}
          </Link>
        </h3>
        
        {post.content && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
        )}
        
        <div className="mt-auto pt-4 flex justify-between items-center">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag.name}
              </span>
            ))}
          </div>
          
          <Link 
            href={`/blog/${post.slug}`} 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center transition-colors duration-200"
          >
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;