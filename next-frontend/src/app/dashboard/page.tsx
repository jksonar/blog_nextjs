'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchBlogPosts, deleteBlogPost, BlogPost } from '@/utils/api';
import Link from 'next/link';
import BlogPostCard from '@/components/BlogPostCard';



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
        setUserBlogPosts(posts.results.map(post => ({
          ...post,
          image: post.featured_image || '', // Map featured_image from API to image, ensure it's always a string
          publish_date: post.publish_date || '', // Ensure publish_date is a string
          category: post.category || { id: 0, name: '', slug: '' }, // Ensure category is an object with id
          tags: post.tags || [], // Ensure tags is an array
          author: post.author ? { ...post.author } : { id: 0, username: '', first_name: '', last_name: '' } // Ensure author conforms to User interface
        })));
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
            <BlogPostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}