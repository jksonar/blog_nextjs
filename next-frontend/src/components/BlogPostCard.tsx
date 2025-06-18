"use client";

import Image from 'next/image';
import { BlogPost } from '@/utils/api';
import Link from 'next/link';


interface BlogPostCardProps {
  post: BlogPost;
  onDelete: (slug: string) => void;
}

export default function BlogPostCard({ post, onDelete }: BlogPostCardProps) {
  return (
    <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
      {post.image && (
        <div className="relative w-full h-48">
          <Image
            src={post.image.startsWith('http') ? post.image : `http://localhost:8000${post.image}`}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-2">Published on {new Date(post.publish_date || '').toLocaleDateString()}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.category && (
            <Link href={`/blog?category=${post.category.slug}`} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-300">
              {post.category.name}
            </Link>
          )}
          {post.tags && post.tags.map(tag => (
            <Link key={tag.slug} href={`/blog?tag=${tag.slug}`} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-300">
              {tag.name}
            </Link>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Link href={`/dashboard/edit-blog/${post.slug}`} className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-3 rounded">
            Edit
          </Link>
          <button
            onClick={() => onDelete(post.slug)}
            className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}