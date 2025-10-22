const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

export interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  workingHours?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const locationApi = {
  // Get office location
  getLocation: async (): Promise<Location> => {
    try {
      const response = await fetch(`${API_BASE_URL}/location`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<Location> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch location');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  }
};