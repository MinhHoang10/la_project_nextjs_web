/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx (ADM005), 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import EmployeeConfirmForm from '@/components/employees/EmployeeConfirmForm';
import { Suspense } from 'react';

/**
 * Trang xác nhận thông tin nhân viên (ADM005).
 */
export default function EmployeeConfirmPage() {
  useAuth();

  return (
    <Suspense fallback={<div className="p-4 text-center">Đang tải dữ liệu xác nhận...</div>}>
      <EmployeeConfirmForm />
    </Suspense>
  );
}
