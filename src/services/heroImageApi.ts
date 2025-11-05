const API_BASE_URL = '/api';

interface HeroImage {
  _id?: string;
  title: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

class HeroImageApi {
  // Get all active hero images (public)
  async getHeroImages() {
    const response = await fetch(`${API_BASE_URL}/hero-images`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch hero images');
    }

    return data.data;
  }

  // Get all hero images for admin (with pagination)
  async getAdminHeroImages(params: PaginationParams = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    // Check if we're in browser before accessing localStorage
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called from the browser');
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/hero-images/admin/all?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch hero images');
    }

    return data.data;
  }

  // Get hero image by ID
  async getHeroImageById(id: string) {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called from the browser');
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/hero-images/admin/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Hero image not found');
    }

    return data.data;
  }

  // Create hero image
  async createHeroImage(heroImage: HeroImage) {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called from the browser');
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/hero-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(heroImage)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create hero image');
    }

    return data.data;
  }

  // Update hero image
  async updateHeroImage(id: string, heroImage: Partial<HeroImage>) {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called from the browser');
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/hero-images/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(heroImage)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to update hero image');
    }

    return data.data;
  }

  // Delete hero image
  async deleteHeroImage(id: string) {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called from the browser');
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/hero-images/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to delete hero image');
    }

    return data.data;
  }

  // Reorder hero images
  async reorderHeroImages(images: Array<{ id: string; order: number }>) {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called from the browser');
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/hero-images/admin/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ images })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to reorder hero images');
    }

    return data.data;
  }
}

export const heroImageApi = new HeroImageApi();    