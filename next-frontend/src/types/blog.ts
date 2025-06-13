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
  content?: string; // Optional because it's only in detail view
  author: User;
  category: Category;
  tags: Tag[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  featured_image: string | null;
  publish_date: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type BlogPostsResponse = PaginatedResponse<BlogPost>;
export type CategoriesResponse = PaginatedResponse<Category>;
export type TagsResponse = PaginatedResponse<Tag>;