const API_BASE_URL = '/api/client';
// TypeScript Interfaces
export interface Client {
  id: string;
  name: string;
  logo?: string;
  location: string;
  category: string;
  order?:number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
}

export interface ClientsResponse {
  clients: Client[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalClients: number;
    limit: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

class ClientApi {
  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data.data;
  }

  // Get all clients with filters and pagination
  async getClients(params: PaginationParams = {}): Promise<ClientsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category && params.category !== 'All') {
        queryParams.append('category', params.category);
      }

   const response = await fetch(`/api/client?${queryParams}`);
      return await this.handleResponse<ClientsResponse>(response);
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  // Get client by ID
  async getClientById(id: string): Promise<Client> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`);
      return await this.handleResponse<Client>(response);
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  }

  // Get categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/categories`);
      return await this.handleResponse<string[]>(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Admin: Create client (requires auth token)
  async createClient(clientData: Omit<Client, 'createdAt' | 'updatedAt' | 'isActive'>, token: string): Promise<Client> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clientData)
      });
      
      return await this.handleResponse<Client>(response);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Admin: Update client (requires auth token)
  async updateClient(
    id: string, 
    clientData: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>, 
    token: string
  ): Promise<Client> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clientData)
      });
      
      return await this.handleResponse<Client>(response);
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  }

  // Admin: Delete client (requires auth token)
  async deleteClient(id: string, token: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return await this.handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
}

export const clientApi = new ClientApi();