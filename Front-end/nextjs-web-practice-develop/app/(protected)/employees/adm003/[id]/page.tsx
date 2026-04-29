/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx (ADM003), 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import EmployeeDetailForm from '@/components/employees/EmployeeDetailForm';

/**
 * Trang chi tiết nhân viên (ADM003).
 */
export default function EmployeeDetailPage() {
  // Kiểm tra quyền truy cập (Authentication)
  useAuth();

  return (
    <div className="row">
      <EmployeeDetailForm />
    </div>
  );
}
