import apiClient from './apiClient';

// Use the configured axios instance with JWT authentication
const api = apiClient;

// Types based on Django models
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content?: string; // Only in detail view
  author: User;
  category: Category | null;
  tags: Tag[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  featured_image: string | null;
  publish_date: string | null;
  likes_count?: number;
  user_has_liked?: boolean;
  average_rating?: number | null;
  user_rating?: number | null;
  comments?: Comment[];
  image?: string; // Added for consistency with BlogPostCard
}

export interface Comment {
  id: number;
  post: number;
  user: User;
  content: string;
  parent: number | null;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

// API functions
export const fetchBlogPosts = async (params?: { category?: string; tag?: string; author?: string }) => {
  try {
    const response = await api.get<{ results: BlogPost[]; count: number }>('/posts/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

export const fetchBlogPostBySlug = async (slug: string) => {
  try {
    const response = await api.get<BlogPost>(`/posts/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get<Category[]>('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchTags = async () => {
  try {
    const response = await api.get<Tag[]>('/tags/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const likeBlogPost = async (slug: string) => {
  try {
    const response = await api.post(`/posts/${slug}/like/`);
    return response.data;
  } catch (error) {
    console.error(`Error liking blog post with slug ${slug}:`, error);
    throw error;
  }
};

export const unlikeBlogPost = async (slug: string) => {
  try {
    const response = await api.post(`/posts/${slug}/unlike/`);
    return response.data;
  } catch (error) {
    console.error(`Error unliking blog post with slug ${slug}:`, error);
    throw error;
  }
};

export const rateBlogPost = async (slug: string, value: number) => {
  try {
    const response = await api.post(`/posts/${slug}/rate/`, { value });
    return response.data;
  } catch (error) {
    console.error(`Error rating blog post with slug ${slug}:`, error);
    throw error;
  }
};

// Comment-related API functions
export const fetchComments = async (postSlug: string) => {
  try {
    const response = await api.get(`/posts/${postSlug}/comments/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postSlug}:`, error);
    throw error;
  }
};

export const createComment = async (postSlug: string, content: string, parentId?: number) => {
  try {
    const data: { content: string; parent?: number } = { content };
    if (parentId) {
      data.parent = parentId;
    }
    const response = await api.post(`/posts/${postSlug}/comments/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating comment for post ${postSlug}:`, error);
    throw error;
  }
};

export const updateComment = async (commentId: number, content: string) => {
  try {
    const response = await api.put(`/comments/${commentId}/`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    throw error;
  }
};

export const deleteComment = async (commentId: number) => {
  const response = await api.delete(`/comments/${commentId}/`);
  return response.data;
};

export const createBlogPost = async (postData: FormData) => {
  const response = await api.post('/posts/', postData);
  return response.data;
};

export const updateBlogPost = async (slug: string, postData: FormData) => {
  const response = await api.patch(`/posts/${slug}/`, postData);
  return response.data;
};

export const deleteBlogPost = async (slug: string) => {
  const response = await api.delete(`/posts/${slug}/`);
  return response.data;
};

export default api;