// Project entity
export interface Project {
  _id: string;
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  year?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Project creation/update form data
export interface ProjectFormData {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  year?: string;
}

// Project pagination params
export interface ProjectPaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

// Project pagination response
export interface ProjectPagination {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  limit: number;
}

// Projects response
export interface ProjectsResponse {
  projects: Project[];
  pagination: ProjectPagination;
}