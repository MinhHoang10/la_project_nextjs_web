/**
 * Copyright(C) 2026 Luvina Software Company
 * employeeService.ts, 4/13/2026 NguyenHuyHoang
 */
import { apiClient } from './client';
import { EmployeeDTO, EmployeeListResponse, EmployeeSearchParams } from '@/types/employee';

/**
 * Khối tiện ích cốt lõi tương tác với các End-point của Nhân viên.
 */
export const employeeService = {
  /**
   * API gọi lưới danh sách nhân viên.
   * 
   * @param params Bộ tham số tìm kiếm và phân trang
   * @return Kết quả Json bọc trong EmployeeListResponse của Spring Boot
   */
  getAllEmployees: async (params: EmployeeSearchParams) => {
    let sortEmployeeName = 'asc';
    let sortCertificationName = 'desc';
    let sortEndDate = 'asc';

    if (Array.isArray(params.sort)) {
       params.sort.forEach(s => {
          if (s.includes('employeeName,')) sortEmployeeName = s.split(',')[1];
          if (s.includes('certificationName,')) sortCertificationName = s.split(',')[1];
          if (s.includes('endDate,')) sortEndDate = s.split(',')[1];
       });
    }

    const limit = params.size || 20;
    const page = params.page || 0;
    const offset = page * limit;

    const response = await apiClient.get<EmployeeListResponse>('/api/employees', {
      params: {
        employeeName: params.name || undefined,
        departmentId: params.departmentId || undefined,
        sortEmployeeName,
        sortCertificationName,
        sortEndDate,
        limit,
        offset,
      },
    });
    return response.data;
  },

  /**
   * Truy vấn thông tin độc lập của một nhân viên bằng ID trên URI Path.
   */
  getEmployeeById: async (id: number) => {
    const response = await apiClient.get<EmployeeDTO>(`/api/employees/${id}`);
    return response.data;
  },
};
