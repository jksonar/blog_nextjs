import axios from 'axios';

interface PostParams {
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
  search?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPosts = async (params?: PostParams) => {
  const response = await api.get('/posts/', { params });
  return response.data;
};

export const fetchPostBySlug = async (slug: string) => {
  const response = await api.get(`/posts/${slug}/`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const fetchTags = async () => {
  const response = await api.get('/tags/');
  return response.data;
};

export const fetchPostsByCategory = async (categorySlug: string) => {
  const response = await api.get('/posts/', {
    params: { category: categorySlug }
  });
  return response.data;
};

export const fetchPostsByTag = async (tagSlug: string) => {
  const response = await api.get('/posts/', {
    params: { tag: tagSlug }
  });
  return response.data;
};

export const fetchRelatedPosts = async (postId: number, categoryId: number) => {
  const response = await api.get('/posts/', {
    params: { category: categoryId, exclude: postId, limit: 3 }
  });
  return response.data;
};

export default api;