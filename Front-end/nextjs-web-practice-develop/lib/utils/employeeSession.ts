/**
 * Copyright(C) 2026 Luvina Software Company
 * employeeSession.ts, 4/24/2026
 */

import { storage } from '@/lib/utils/storage';
import { EmployeeFormDTO } from '@/types/employee';

export const SESSION_KEY_EMPLOYEE = 'adm004_employee_data';

/**
 * Lấy dữ liệu nhân viên từ sessionStorage
 */
export const getEmployeeFromSession = (): EmployeeFormDTO | null => {
  return storage.session.get<EmployeeFormDTO>(SESSION_KEY_EMPLOYEE);
};

/**
 * Lưu dữ liệu nhân viên vào sessionStorage
 */
export const setEmployeeToSession = (data: EmployeeFormDTO) => {
  storage.session.set(SESSION_KEY_EMPLOYEE, data);
};

/**
 * Xóa dữ liệu nhân viên trong sessionStorage
 */
export const clearEmployeeSession = () => {
  storage.session.remove(SESSION_KEY_EMPLOYEE);
};
