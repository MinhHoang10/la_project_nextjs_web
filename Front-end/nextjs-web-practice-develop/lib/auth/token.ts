/**
 * Copyright(C) 2026 Luvina Software Company
 * token.ts, 4/13/2026 NguyenHuyHoang
 */
import { storage } from '@/lib/utils/storage';

/**
 * Ghi lại thẻ thông hành JWT và kiểu token vào SessionStorage.
 */
export function storeToken(token: string, tokenType: string) {
  storage.session.set('access_token', token);
  storage.session.set('token_type', tokenType);
}

/**
 * Moi token ra từ Session Browser nếu như đã từng lưu lúc Login.
 */
export function getToken(): { accessToken: string; tokenType: string } | null {
  const accessToken = storage.session.get<string>('access_token');
  const tokenType = storage.session.get<string>('token_type');

  if (accessToken && tokenType) {
    return { accessToken, tokenType };
  }
  return null;
}

/**
 * Rửa sạch Session, ép người dùng bị văng khỏi trạng thái đang chạy.
 */
export function removeToken() {
  storage.session.remove('access_token');
  storage.session.remove('token_type');
}

/**
 * Phanh phui thân xác chuỗi JWT Base64 (Decode) để xem ngày hết hạn (claims exp).
 * Tránh việc cứ nhồi token cũ nát lên gọi API sẽ gây phí tài nguyên mạng.
 * 
 * @param token Chuỗi Access Token (JWT)
 * @return True nếu rỗng hoặc đã trễ hạn, False nếu vẫn còn giá trị sử dụng
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // Nếu hỏng bét format thì coi như là hết hạn nốt
  }
}
