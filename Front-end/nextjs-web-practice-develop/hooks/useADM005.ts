/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM005.ts, 4/21/2026 NguyenHuyHoang
 */
import { useRouter } from 'next/navigation';
import { EmployeeFormDTO } from '@/types/employee';
import { employeeApi } from '@/lib/api/employee.api';
import { getEmployeeFromSession, clearEmployeeSession } from '@/lib/utils/employeeSession';
import { QUERY_PARAMS, APP_MODES } from '@/lib/constants/common';

export function useADM005() {
  const router = useRouter();

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
    if (!employeeFromSession) {
      return;
    }

    try {
      // Chuẩn hóa payload: Loại bỏ mọi trường undefined, null, chuỗi rỗng
      const cleanedEmployeeData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(employeeFromSession)) {
        // Bỏ qua: giá trị null, undefined, hoặc chuỗi rỗng
        if (value === null || value === undefined || value === '') continue;
        cleanedEmployeeData[key] = value;
      }

      if (cleanedEmployeeData['employeeId']) {
        await employeeApi.updateEmployee(cleanedEmployeeData as any);
      } else {
        await employeeApi.createEmployee(cleanedEmployeeData as any);
      }

      // Sau khi lưu thành công:
      clearEmployeeSession();
      router.push('/employees/adm006');
    } catch (error: any) {

      // Lấy dữ liệu lỗi từ backend
      const backendData = error?.response?.data;

      // Trích xuất danh sách lỗi 
      let errors: any[] = [];
      if (backendData && typeof backendData === 'object') {
        errors = backendData.messages || (Array.isArray(backendData) ? backendData : []);
      }

      if (errors.length > 0) {
        const errMessages = errors
          .map((err: any) => `[${err.code}] ${err.params?.join(', ') || ''}`)
          .join('\n');
        alert(errMessages);
      } else {
        // Lỗi hệ thống (500, DB error...) -> Chuyển sang màn hình System Error
        router.push('/employees/system_error');
      }
    }
  };

  return {
    getEmployeeFromSession,
    clearEmployeeSession,
    handleBack,
    handleOK
  };
}
