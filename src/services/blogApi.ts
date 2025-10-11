import { 
  Blog, 
  BlogsResponse, 
  BlogPaginationParams,
  BlogCategoriesResponse 
} from '../types/blog.types';
import { ApiResponse } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
class BlogApi {
  async getBlogs(params: BlogPaginationParams = {}): Promise<BlogsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category && params.category !== 'All') queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.featured) queryParams.append('featured', 'true');

    const response = await fetch(`${API_BASE_URL}/blogs?${queryParams}`);
    const data: ApiResponse<BlogsResponse> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch blogs');
    }
    
    return data.data;
  }

  async getAllBlogsAdmin(params: BlogPaginationParams = {}, token: string): Promise<BlogsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category && params.category !== 'All') queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/blogs/admin/all?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data: ApiResponse<BlogsResponse> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch blogs');
    }
    
    return data.data;
  }

  async getBlogById(id: string): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    const data: ApiResponse<Blog> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Blog not found');
    }
    
    return data.data;
  }

  async getFeaturedBlogs(limit: number = 3): Promise<Blog[]> {
    const response = await fetch(`${API_BASE_URL}/blogs/featured?limit=${limit}`);
    const data: ApiResponse<Blog[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch featured blogs');
    }
    
    return data.data;
  }

  async getCategories(): Promise<BlogCategoriesResponse> {
    const response = await fetch(`${API_BASE_URL}/blogs/categories`);
    const data: ApiResponse<BlogCategoriesResponse> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    
    return data.data;
  }

  async createBlog(blogData: FormData, token: string): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: blogData
    });
    
    const data: ApiResponse<Blog> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create blog');
    }
    
    return data.data;
  }

  async updateBlog(id: string, blogData: FormData, token: string): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: blogData
    });
    
    const data: ApiResponse<Blog> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update blog');
    }
    
    return data.data;
  }

  async deleteBlog(id: string, token: string): Promise<{ deletedId: string; title: string }> {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data: ApiResponse<{ deletedId: string; title: string }> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete blog');
    }
    
    return data.data;
  }
}

export const blogApi = new BlogApi();