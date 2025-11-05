export interface CreateClientRequest {
  id: string;
  name: string;
  logo?: string;
  location: string;
  category: string;
}
export interface UpdateClientRequest {
  name?: string;
  logo?: string;
  location?: string;
  category?: string;
  isActive?: boolean;
}
export interface ClientQueryParams {
  category?: string;
  page?: number;
  limit?: number;
}
export interface ClientsResponse {
  clients: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
export interface ClientCategoriesResponse {
  categories: string[];
}
export interface DeleteClientResponse {
  deletedId: string;
}