/**
 * Copyright(C) 2026 Luvina Software Company
 * token.ts, 4/13/2026 NguyenHuyHoang
 */
import { storage } from '@/lib/utils/storage';

/**
 * Ghi lại thẻ thông hành JWT và kiểu token vào LocalStorage.
 */
export function storeToken(token: string, tokenType: string) {
  storage.local.set('access_token', token);
  storage.local.set('token_type', tokenType);
}

/**
 * Lấy token ra từ LocalStorage sau khi đã lưu lúc Login.
 */
export function getToken(): { accessToken: string; tokenType: string } | null {
  const accessToken = storage.local.get<string>('access_token');
  const tokenType = storage.local.get<string>('token_type');

  if (accessToken && tokenType) {
    return { accessToken, tokenType };
  }
  return null;
}

/**
 * Loại bỏ token LocalStorage.
 */
export function removeToken() {
  storage.local.remove('access_token');
  storage.local.remove('token_type');
}

/**
 * Kiểm tra xem token có bị hết hạn không.
 * @param token Chuỗi Access Token (JWT)
 * @return True nếu rỗng hoặc đã hết hạn, False nếu vẫn còn giá trị sử dụng
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // Nếu hỏng format thì coi như là hết hạn nốt
  }
}
