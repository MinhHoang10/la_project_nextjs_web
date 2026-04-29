/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx (ADM004), 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import EmployeeInputForm from '@/components/employees/EmployeeInputForm';

/**
 * Trang thêm mới/chỉnh sửa nhân viên (ADM004).
 */
export default function EmployeeEditPage() {
  useAuth();
  return (
    <Suspense fallback={<div className="p-4 text-center">Đang tải cấu hình...</div>}>
      <EmployeeInputForm />
    </Suspense>
  );
}
