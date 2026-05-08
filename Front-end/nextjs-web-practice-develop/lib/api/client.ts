/**
 * Copyright(C) 2026 Luvina Software Company
 * client.ts, 4/13/2026 NguyenHuyHoang
 */
import axios from 'axios';
import { storage } from '@/lib/utils/storage';

// Lấy gốc URL từ biến môi trường, phòng trường hợp trỏ Backend lên Server khác
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

/** Khởi tạo bộ máy gởi Request mặc định. Content-Type khai báo là JSON. */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Trạm gác chặn đứng mọi Request và Response trước khi chúng được gửi/nhận.
 * Dùng để tự động "đính kèm" JWT Token vào mọi Request.
 * Và tự động chuyển hướng màn nếu Response báo lỗi 401 Unauthorized.
 */
export function setupInterceptors(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use(
    (config) => {
      // Đưa Token vào header Authorization
      const token = storage.local.get<string>('access_token');
      if (token) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401 hết hạn hoặc chưa đăng nhập => Xóa session và văng ra màn Login
      if (error.response?.status === 401) {
        storage.local.remove('access_token');
        storage.local.remove('token_type');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
}

// Chạy khởi tạo Interceptor cho singleton apiClient
setupInterceptors(apiClient);

export { apiClient };
