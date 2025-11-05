// src/types/index.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  admin?: {
    id: string;
    email: string;
    role?: string;
  };
  body: any;
  query: any;
  params: any;
  headers: any;
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Export contact types
export * from './contact';
export * from './contact.types';

// Export client types - only from one file to avoid duplicates
export * from './client.types';

// Export blog types - only from one file to avoid duplicates
export * from './blog.types';

// Export project types - only from one file to avoid duplicates
export * from './project.types';

// Export other types
export * from './admin';
export * from './upload';