'use client';

import { useAuth } from '@/hooks/useAuth';
import { Suspense } from 'react';
import EmployeeInputForm from '@/components/employees/EmployeeInputForm';


/**
 * Trang chỉnh sửa nhân viên
 */
export default function EmployeeEditPage() {
  useAuth();
  return (
    <Suspense fallback={<div className="p-4 text-center">Đang tải cấu hình...</div>}>
      <EmployeeInputForm />
    </Suspense>
  );
}
