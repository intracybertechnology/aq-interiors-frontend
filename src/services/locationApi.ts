import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

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
    const response = await axios.get<ApiResponse<Location>>(`${API_BASE_URL}/location`);
    return response.data.data;
  }
};