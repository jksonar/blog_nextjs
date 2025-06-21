"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchBlogPostBySlug, updateBlogPost } from '@/utils/api';
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
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [post, setPost] = useState<any>(null); // Add post state

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redirectToBlog, setRedirectToBlog] = useState(false);

  useEffect(() => {
    const getBlogPost = async () => {
      try {
        const fetchedPost = await fetchBlogPostBySlug(slug);
        if (user && fetchedPost.author.username !== user.username) {
          setError('You do not have permission to edit this post.');
          setLoading(false);
          return;
        }
        setPost(fetchedPost); // Set the post state
        setTitle(fetchedPost.title || '');
        setContent(fetchedPost.content || '');
        setCategory(fetchedPost.category?.slug || '');
        setTags(fetchedPost.tags?.map((tag: { slug: string }) => tag.slug).join(', ') || '');
      } catch (err) {
        setError('Failed to fetch blog post.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getBlogPost();
  }, [slug, user]);

  useEffect(() => {
    if (redirectToBlog) {
      router.push(`/blog/${slug}`);
    }
  }, [redirectToBlog, router, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (category) {
        formData.append('category_slug', category);
      }
      if (tags) {
        tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').forEach(tag => {
          formData.append('tags_slugs', tag);
        });
      }
      if (featuredImage instanceof File) {
        formData.append('featured_image', featuredImage);
      }

      await updateBlogPost(slug, formData as any);
      setSuccess('Blog post updated successfully!');
      // Trigger a re-render to activate the useEffect for navigation
      // This is a workaround, ideally, you'd have a state to control navigation
      // or use a global state management for success messages and redirects.
      // For now, setting a state that useEffect depends on will work.
      // For a more robust solution, consider a custom hook for form submissions.
      setRedirectToBlog(true);
    } catch (err) {
      setError('Failed to update blog post. Please try again.');
      console.log(err);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading blog post...</div>;
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
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="featuredImage">
            Featured Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="featuredImage"
            type="file"
            accept="image/*"
            onChange={(e) => setFeaturedImage(e.target.files ? e.target.files[0] : null)}
          />
          {post?.featured_image && ( // Use optional chaining for post
            <div className="mt-2">
              <p className="text-gray-600 text-sm">Current Image:</p>
              <img src={post.featured_image.startsWith('http') ? post.featured_image : `http://localhost:8000${post.featured_image}`} alt="Current Featured" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">Error: {error}</p>}
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