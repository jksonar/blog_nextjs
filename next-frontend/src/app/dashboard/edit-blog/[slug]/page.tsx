"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchBlogPostDetail, updateBlogPost } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

interface EditBlogPageProps {
  params: { slug: string };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { slug } = params;
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const getBlogPost = async () => {
      try {
        const post = await fetchBlogPostDetail(slug);
        if (user && post.author.username !== user.username) {
          setError('You do not have permission to edit this post.');
          setLoading(false);
          return;
        }
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category?.slug || '');
        setTags(post.tags.map((tag: { slug: string }) => tag.slug).join(', '));
      } catch (err) {
        setError('Failed to fetch blog post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getBlogPost();
  }, [slug, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateBlogPost(slug, {
        title,
        content,
        category_slug: category,
        tags_slugs: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      });
      setSuccess('Blog post updated successfully!');
      router.push(`/blog/${slug}`);
    } catch (err) {
      setError('Failed to update blog post. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading blog post...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Blog Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
            id="content"
            placeholder="Write your blog post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category Slug
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            placeholder="e.g., technology, travel, food"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
            Tags (comma-separated slugs)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="tags"
            type="text"
            placeholder="e.g., javascript, react, django"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
}