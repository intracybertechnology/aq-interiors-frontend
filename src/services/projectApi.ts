const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

class ProjectApi {
  // Get all projects with filters and pagination
  async getProjects(params: PaginationParams = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category && params.category !== 'All') queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/projects?${queryParams}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch projects');
    }
    
    return data.data;
  }

  // Get project by ID
  async getProjectById(id: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Project not found');
    }
    
    return data.data;
  }

  // Get categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/projects/categories`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    
    return data.data;
  }

  // Admin: Create project (requires auth token)
  async createProject(projectData: any, token: string) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create project');
    }
    
    return data.data;
  }

  // Admin: Update project (requires auth token)
  async updateProject(id: string, projectData: any, token: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update project');
    }
    
    return data.data;
  }

  // Admin: Delete project (requires auth token)
  async deleteProject(id: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete project');
    }
    
    return data.data;
  }
}

export const projectApi = new ProjectApi();