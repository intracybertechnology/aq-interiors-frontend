import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenResponse,
  DashboardStats,
  EnquiriesResponse,
  UpdateEnquiryStatusRequest,
  ApiResponse,
  EnquiryFilters
} from '../types/admin';

// Next.js uses NEXT_PUBLIC_ prefix for client-side env variables
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

class AdminApiService {
  private getAuthHeaders(): HeadersInit {
  
    if (typeof window === 'undefined') {
      return {
        'Content-Type': 'application/json',
      };
    }
    
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (!refreshed && typeof window !== 'undefined') {
          localStorage.clear();
          window.location.href = '/admin/login';
        }
      }
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/admin/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const result: RefreshTokenResponse = await response.json();
        localStorage.setItem('adminToken', result.data.tokens.accessToken);
        localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<DashboardStats>(response);
      return result.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  async getEnquiries(filters: EnquiryFilters = {}): Promise<EnquiriesResponse['data']> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/enquiries?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<EnquiriesResponse['data']>(response);
      return result.data;
    } catch (error) {
      console.error('Get enquiries error:', error);
      throw error;
    }
  }

  async updateEnquiryStatus(
    enquiryId: string, 
    updateData: UpdateEnquiryStatusRequest
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/enquiries/${enquiryId}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      await this.handleResponse(response);
    } catch (error) {
      console.error('Update enquiry status error:', error);
      throw error;
    }
  }

  async deleteEnquiry(enquiryId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/enquiries/${enquiryId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      await this.handleResponse(response);
    } catch (error) {
      console.error('Delete enquiry error:', error);
      throw error;
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminInfo');
    window.location.href = '/admin/login';
  }
}

export default new AdminApiService();