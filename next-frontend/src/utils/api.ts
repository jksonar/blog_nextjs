import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

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
}

// API functions
export const fetchBlogPosts = async (params?: { category?: string; tag?: string }) => {
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

export default api;