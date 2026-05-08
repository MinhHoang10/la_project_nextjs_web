/**
 * Copyright(C) 2026 Luvina Software Company
 * useAuth.ts, 4/13/2026 NguyenHuyHoang
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenExpired } from '@/lib/auth/token';

/**
 * Hook kiểm tra phân quyền người dùng (Authentication Guard).
 * 
 * Mục đích:
 * - Yêu cầu người dùng ĐÃ ĐĂNG NHẬP (có token hợp lệ) mới được truy cập các trang nội bộ (Protected).
 * - Nếu chưa đăng nhập hoặc token đã hết hạn, lập tức điều hướng về màn hình Đăng nhập (Login).
 * 
 * Cách dùng: Gọi hook này ở đầu các Component/Page cần bảo mật.
 */
const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    // Lấy thông tin token từ bộ nhớ (LocalStorage/Cookie)
    const token = getToken();
    
    // Nếu không có token hoặc token đã quá hạn sử dụng
    if (!token || isTokenExpired(token?.accessToken)) {
      // Ép buộc người dùng quay lại màn hình Login để xác thực lại
      router.push('/login');
    }
  }, [router]);
};

/**
 * Hook bảo vệ màn hình Khách/Đăng nhập (Guest Guard).
 * 
 * Mục đích:
 * - Tránh việc người dùng đã đăng nhập rồi vẫn có thể truy cập lại màn hình Login.
 * - Nếu User đã có token hợp lệ, tự động điều hướng họ vào thẳng trang Danh sách (ADM002).
 */
const useGuest = () => {
    const router = useRouter();
  
    useEffect(() => {
      // Kiểm tra sự tồn tại và tính hợp lệ của token hiện tại
      const token = getToken();
      if (token && !isTokenExpired(token?.accessToken)) {
        // Nếu đã login, đưa thẳng vào trang chủ của ứng dụng
        router.push('/employees/adm002');
      }
    }, [router]);
}

export { useAuth, useGuest };
