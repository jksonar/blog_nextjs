'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchBlogPosts, deleteBlogPost } from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string;
  publish_date: string;
  category: { name: string; slug: string };
  tags: { name: string; slug: string }[];
  author: { username: string };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [userBlogPosts, setUserBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const getMyBlogPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Assuming the API has a way to filter posts by author, e.g., /api/blogposts/?author=username
        // This might require a modification to the Django backend's BlogPostViewSet to filter by author
        const posts = await fetchBlogPosts({ author: user.username });
        setUserBlogPosts(posts.results);
      } catch (err) {
        setError('Failed to fetch your blog posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMyBlogPosts();
  }, [user]);

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(slug);
        setUserBlogPosts(userBlogPosts.filter(post => post.slug !== slug));
        setSuccess('Blog post deleted successfully!');
      } catch (err) {
        setError('Failed to delete blog post. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Please log in to view your dashboard.</p>
        <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{user.username}'s Dashboard</h1>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
      <div className="mb-6">
        <Link href="/dashboard/new-blog" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Blog Post
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Blog Posts</h2>
      {userBlogPosts.length === 0 ? (
        <p>You haven't created any blog posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBlogPosts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {post.image && (
                <div className="relative w-full h-48">
                  <Image
                    src={post.image}
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
                <p className="text-gray-600 text-sm mb-2">Published on {new Date(post.publish_date).toLocaleDateString()}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Link href={`/blog?category=${post.category.slug}`} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-300">
                    {post.category.name}
                  </Link>
                  {post.tags.map(tag => (
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
                    onClick={() => handleDelete(post.slug)}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}