/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx (ADM002), 4/13/2026 NguyenHuyHoang
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import EmployeeListForm from '@/components/employees/EmployeeListForm';

/**
 * Trang danh sách nhân viên - Entry point chính của ứng dụng sau khi đăng nhập (ADM002).
 */
export default function EmployeeListPage() {
  // Kiểm tra quyền truy cập (Authentication)
  useAuth();

  return (
    <EmployeeListForm />
  );
}
