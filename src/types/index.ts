export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  year?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  location: string;
  category: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
}
// Contact Enquiry Interface (matches backend Contact model)
export interface ContactEnquiry {
  _id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  serviceInterestedIn?: string;
  projectDetails?: string;
  status: 'new' | 'contacted' | 'closed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Interface
export interface ContactApiResponse {
  success: boolean;
  message: string;
  data?: ContactEnquiry;
}

// Update Status Request
export interface UpdateStatusRequest {
  status: 'new' | 'contacted' | 'closed';
  adminNotes?: string;
}


export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'office' | 'branch' | 'service_area' | 'project_location';
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  apiKey: string;
}

export interface MarkerData {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  content: string;
  type: Location['type'];
}
// Blog interfaces
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

export interface BlogsResponse {
  success: boolean;
  message: string;
  data: {
    blogs: Blog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Common API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Common pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form submission state
export interface FormState extends LoadingState {
  isSuccess: boolean;
}

// Re-export all types
export * from './admin';
export * from './blog.types';
export * from './project.types';
export * from './contact.types';
export * from './client.types';
export * from './location.types';