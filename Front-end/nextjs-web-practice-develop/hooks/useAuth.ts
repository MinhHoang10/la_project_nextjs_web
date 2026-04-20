/**
 * Copyright(C) 2026 Luvina Software Company
 * useAuth.ts, 4/13/2026 NguyenHuyHoang
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenExpired } from '@/lib/auth/token';

/**
 * Hook kiểm tra phân quyền người dùng.
 * Yêu cầu người dùng MỚI ĐĂNG NHẬP (token hợp lệ) mới được truy cập các trang nội bộ (Protected).
 * Nếu chưa đăng nhập hoặc token đã hết hạn, lập tức đá văng về màn Login.
 */
const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired(token?.accessToken)) {
      router.push('/login');
    }
  }, [router]);
};

/**
 * Hook bảo vệ màn hình Login/Guest.
 * Tránh việc User đã đăng nhập hợp lệ rồi nhưng vẫn gõ URL quay lại màn Login, 
 * nó sẽ điều hướng trực tiếp họ vào trang danh sách nhân viên.
 */
const useGuest = () => {
    const router = useRouter();
  
    useEffect(() => {
      const token = getToken();
      if (token && !isTokenExpired(token?.accessToken)) {
        router.push('/employees/adm002');
      }
    }, [router]);
}

export { useAuth, useGuest };
