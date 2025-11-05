export interface CreateProjectRequest {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  year?: string;
}
export interface UpdateProjectRequest {
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  images?: string[];
  location?: string;
  year?: string;
  isActive?: boolean;
}
export interface ProjectQueryParams {
  category?: string;
  search?: string;
  page?: string;
  limit?: string;
}
export interface ProjectPagination {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  limit: number;
}
export interface ProjectsResponse {
  projects: any[];
  pagination: ProjectPagination;
}
export interface DeleteProjectResponse {
  deletedId: string;
  title: string;
}