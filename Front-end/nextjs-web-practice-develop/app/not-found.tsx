/**
 * Copyright(C) 2026 Luvina Software Company
 * not-found.tsx, 5/07/2026 NguyenHuyHoang
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Trang xử lý lỗi 404 (URL không tồn tại).
 * Thay vì hiển thị trang 404 mặc định của Next.js,
 * tự động chuyển hướng người dùng sang màn hình System Error.
 */
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Dùng replace để không lưu URL sai vào lịch sử trình duyệt
    router.replace('/employees/system_error');
  }, [router]);

  // Không hiển thị gì trong lúc chờ redirect hoàn tất
  return null;
}
