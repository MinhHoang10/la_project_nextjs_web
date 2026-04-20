/**
 * Copyright(C) 2026 Luvina Software Company
 * api.ts, 4/13/2026 NguyenHuyHoang
 */

/**
 * Interface cấu trúc Exception chung khi Call Backend API.
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * Interface chứa tham số truyền lên cho API danh sách (Có phân trang).
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Interface Metadata trả về của luồng Pagination.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
