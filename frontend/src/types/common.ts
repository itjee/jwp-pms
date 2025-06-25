export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'active' | 'inactive' | 'pending' | 'completed';