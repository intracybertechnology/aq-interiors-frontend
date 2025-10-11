// Admin interface matching backend
export interface IAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    admin: IAdmin;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// Dashboard types
export interface DashboardStats {
  overview: {
    totalEnquiries: number;
    newEnquiries: number;
    monthlyEnquiries: number;
    weeklyEnquiries: number;
  };
  statusBreakdown: Record<string, number>;
  serviceInterest: Array<{
    service: string;
    count: number;
  }>;
  recentEnquiries: Array<{
    _id: string;
    fullName: string;
    emailAddress: string;
    serviceInterestedIn?: string;
    status: string;
    createdAt: string;
  }>;
}

// Enquiry types
export interface EnquiryItem {
  _id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  serviceInterestedIn?: string;
  projectDetails: string;
  status: 'new' | 'contacted' | 'closed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiriesResponse {
  success: boolean;
  message: string;
  data: {
    enquiries: EnquiryItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UpdateEnquiryStatusRequest {
  status: 'new' | 'contacted' | 'closed';
  adminNotes?: string;
}

// Filter types
export interface EnquiryFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code?: string;
    details?: any;
  };
}

// Auth context types
export interface AuthContextType {
  admin: IAdmin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  refreshToken: () => Promise<boolean>;
}

// Component props types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

// Error types
export interface AdminApiError extends Error {
  status?: number;
  code?: string;
}

// Status constants
export const ENQUIRY_STATUSES = ['new', 'contacted', 'closed'] as const;
export type EnquiryStatus = typeof ENQUIRY_STATUSES[number];