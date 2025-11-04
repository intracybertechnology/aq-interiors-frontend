
export interface Client {
  id: string;
  name: string;
  logo?: string;
  location: string;
  category: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Client pagination params
export interface ClientPaginationParams {
  page?: number;
  limit?: number;
  category?: string;
}

// Client pagination response
export interface ClientPagination {
  currentPage: number;
  totalPages: number;
  totalClients: number;
  limit: number;
}

// Clients response
export interface ClientsResponse {
  clients: Client[];
  pagination: ClientPagination;
}