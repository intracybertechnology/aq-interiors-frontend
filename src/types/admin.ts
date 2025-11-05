export interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
}
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export type LoginRequest = AdminLoginRequest;

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}
export interface AdminLoginResponse {
  admin: AdminInfo;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Add RefreshTokenResponse
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
export interface UpdateEnquiryStatusRequest {
  status: 'new' | 'contacted' | 'closed';
  adminNotes?: string;
}
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
    createdAt: Date;
  }>;
}
// Add EnquiriesResponse
export interface EnquiriesResponse {
  success: boolean;
  message: string;
  data: {
    enquiries: Array<{
      _id: string;
      fullName: string;
      emailAddress: string;
      phoneNumber?: string;
      serviceInterestedIn?: string;
      message?: string;
      status: 'new' | 'contacted' | 'closed';
      adminNotes?: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// Add EnquiryFilters
export interface EnquiryFilters {
  page?: number;
  limit?: number;
  status?: 'new' | 'contacted' | 'closed' | '';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}