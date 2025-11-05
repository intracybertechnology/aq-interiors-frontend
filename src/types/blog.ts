export interface CreateBlogRequest {
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  category: string;
  tags?: string | string[];
  readTime?: string;
  featured?: boolean | string;
}
export interface UpdateBlogRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  tags?: string[];
  readTime?: string;
  featured?: boolean;
  isPublished?: boolean;
}
export interface BlogQueryParams {
  category?: string;
  search?: string;
  featured?: string;
  page?: string;
  limit?: string;
}
export interface BlogsResponse {
  blogs: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
export interface BlogCategoriesResponse {
  categories: string[];
}
export interface DeleteBlogResponse {
  deletedId: string;
  title: string;
}