/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM005.ts, 4/21/2026 NguyenHuyHoang
 */
import { useRouter } from 'next/navigation';
import { EmployeeFormDTO } from '@/types/employee';
import { employeeApi } from '@/lib/api/employee.api';
import { storage } from '@/lib/utils/storage';
import { QUERY_PARAMS, APP_MODES } from '@/lib/constants/common';

const SESSION_KEY = 'adm004_employee_data';

export function useADM005() {
  const router = useRouter();

  /**
   * Lấy dữ liệu nhân viên từ sessionStorage
   */
  const getEmployeeFromSession = (): EmployeeFormDTO | null => {
    return storage.session.get<EmployeeFormDTO>(SESSION_KEY);
  };

  /**
   * Xóa dữ liệu trong session
   */
  const clearStorageSession = () => {
    storage.session.remove(SESSION_KEY);
  };

  /**
   * Xử lý quay lại màn hình adm004 từ adm005
   */
  const handleBack = () => {
    router.push(`/employees/adm004?${QUERY_PARAMS.MODE}=${APP_MODES.BACK}`);
  };

  /**
   * Xử lý lưu chính thức vào DB thông qua API
   */
  const handleOK = async () => {
    const employeeFromSession = getEmployeeFromSession();
    if (!employeeFromSession) return;

    try {
      console.log("Đang thực hiện lưu nhân viên:", employeeFromSession);

      // Chuẩn hóa payload: Loại bỏ mọi trường undefined, null, chuỗi rỗng
      // để tránh Backend bị lỗi 400 khi parse kiểu số từ chuỗi rỗng
      const cleanedEmployeeData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(employeeFromSession)) {
        // Bỏ qua: giá trị null, undefined, hoặc chuỗi rỗng
        if (value === null || value === undefined || value === '') continue;
        cleanedEmployeeData[key] = value;
      }

      console.log("Payload sẽ gửi lên Backend:", cleanedEmployeeData);

      if (cleanedEmployeeData['employeeId']) {
        const empId = cleanedEmployeeData['employeeId'] as number;
        await employeeApi.updateEmployee(empId, cleanedEmployeeData as any);
      } else {
        await employeeApi.createEmployee(cleanedEmployeeData as any);
      }

      // Sau khi lưu thành công:
      clearStorageSession();
      router.push('/employees/adm006');
    } catch (error: any) {
      console.error('Error saving employee:', error);

      // Lấy dữ liệu lỗi từ backend
      const backendData = error?.response?.data;

      // Trích xuất danh sách lỗi (hỗ trợ cả trường hợp backendData là object chứa errors hoặc chính backendData là errors)
      let errors: any[] = [];
      if (backendData && typeof backendData === 'object') {
        errors = backendData.errors || (Array.isArray(backendData) ? backendData : []);
      }

      if (errors.length > 0) {
        const errMessages = errors
          .map((err: any) => `[${err.code}] ${err.params?.join(', ') || ''}`)
          .join('\n');
        alert('Validation failed:\n' + errMessages);
      } else {
        // Lỗi hệ thống (500, DB error...) -> Chuyển sang màn hình System Error
        router.push('/employees/system_error');
      }
    }
  };

  return {
    getEmployeeFromSession,
    clearStorageSession,
    handleBack,
    handleOK
  };
}
