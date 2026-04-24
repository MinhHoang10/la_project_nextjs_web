/**
 * Copyright(C) 2026 Luvina Software Company
 * auth.ts, 4/13/2026 NguyenHuyHoang
 */

/**
 * Interface Gói dữ liệu Login Gửi đi.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interface Gói dữ liệu Response trả về lúc Đăng nhập thành công.
 */
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

/**
 * Interface Dữ liệu nén trong Payload JWT.
 */
export interface TokenPayload {
  exp: number; // Ngày hết hạn Timestamp
}
