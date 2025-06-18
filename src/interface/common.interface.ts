// Common API response format
export interface ApiResponse<T> {
  data: T[];
  success: boolean;
  total: number;
  pageSize: number;
  current: number;
}

export interface SingleApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ListApiResponse<T> {
  data: T[];
  success: boolean;
  message?: string;
}

// Common search params
export interface CommonSearchParams {
  search?: string;
  sorter?: string;
  current?: number;
  pageSize?: number;
}
