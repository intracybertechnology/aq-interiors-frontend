import { 
  Blog, 
  BlogsResponse, 
  BlogPaginationParams,
  BlogCategoriesResponse 
} from '../types/blog.types';
import { ApiResponse } from '../types';

// Next.js API routes base URL
const API_BASE_URL = '/api';

class BlogApi {
  async getBlogs(params: BlogPaginationParams = {}): Promise<BlogsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category && params.category !== 'All') queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.featured) queryParams.append('featured', 'true');

    const url = `${API_BASE_URL}/blogs?${queryParams}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch blogs`);
    }

    const data: ApiResponse<BlogsResponse> = await response.json();
    
    if (!data.success || !data.data) {
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

    const url = `${API_BASE_URL}/blogs/admin/all?${queryParams}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch admin blogs`);
    }

    const data: ApiResponse<BlogsResponse> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to fetch blogs');
    }
    
    return data.data;
  }

  async getBlogById(id: string): Promise<Blog> {
    const url = `${API_BASE_URL}/blogs/${id}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Blog not found');
      }
      throw new Error(`HTTP ${response.status}: Failed to fetch blog`);
    }

    const data: ApiResponse<Blog> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Blog not found');
    }
    
    return data.data;
  }

  async getFeaturedBlogs(limit: number = 3): Promise<Blog[]> {
    const url = `${API_BASE_URL}/blogs/featured?limit=${limit}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch featured blogs`);
    }

    const data: ApiResponse<Blog[]> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to fetch featured blogs');
    }
    
    return data.data;
  }

  async getCategories(): Promise<BlogCategoriesResponse> {
    const url = `${API_BASE_URL}/blogs/categories`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch categories`);
    }

    const data: ApiResponse<BlogCategoriesResponse> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    
    return data.data;
  }

  async createBlog(blogData: FormData, token: string): Promise<Blog> {
    const url = `${API_BASE_URL}/blogs`;
    console.log('📡 Creating blog at:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // NOTE: Don't set Content-Type for FormData - browser sets it automatically with boundary
      },
      body: blogData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to create blog`);
    }

    const data: ApiResponse<Blog> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to create blog');
    }
    
    return data.data;
  }

  async updateBlog(id: string, blogData: FormData, token: string): Promise<Blog> {
    const url = `${API_BASE_URL}/blogs/${id}`;
    console.log('Updating blog at:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // NOTE: Don't set Content-Type for FormData
      },
      body: blogData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to update blog`);
    }

    const data: ApiResponse<Blog> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to update blog');
    }
    
    return data.data;
  }

  async deleteBlog(id: string, token: string): Promise<{ deletedId: string; title: string }> {
    const url = `${API_BASE_URL}/blogs/${id}`;
    console.log('🗑️ Deleting blog at:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete blog`);
    }

    const data: ApiResponse<{ deletedId: string; title: string }> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to delete blog');
    }
    
    return data.data;
  }

  getBaseUrl(): string {
    return API_BASE_URL;
  }
}

export const blogApi = new BlogApi();

export { API_BASE_URL };