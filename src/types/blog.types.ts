// Blog entity
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog creation/update form data
export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
}

// Blog pagination params
export interface BlogPaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}

// Blog pagination response
export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Blogs response
export interface BlogsResponse {
  blogs: Blog[];
  pagination: BlogPagination;
}

// Categories response
export interface BlogCategoriesResponse {
  categories: string[];
}