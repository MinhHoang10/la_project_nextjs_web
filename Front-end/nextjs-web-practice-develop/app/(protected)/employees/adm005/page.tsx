'use client';

import { useAuth } from '@/hooks/useAuth';
import EmployeeConfirmForm from '@/components/employees/EmployeeConfirmForm';

/**
 * Trang xác nhận thông tin nhân viên
 */
export default function EmployeeConfirmPage() {
  useAuth();

  return (
    <EmployeeConfirmForm />
  );
}

