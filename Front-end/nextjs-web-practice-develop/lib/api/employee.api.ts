/**
 * Copyright(C) 2026 Luvina Software Company
 * employeeService.ts, 4/13/2026 NguyenHuyHoang
 */
import { apiClient } from './client';
import { EmployeeDTO, EmployeeListResponse, EmployeeSearchParams, EmployeeFormDTO, EmployeeDetailResponse } from '@/types/employee';

/**
 * Khối tiện ích cốt lõi tương tác với các End-point của Nhân viên.
 */
/**
 * Chuyển đổi dữ liệu từ Frontend Form (phẳng) sang cấu trúc Backend Request (lồng nhau & định dạng ngày)
 */
const toEmployeeRequest = (data: EmployeeFormDTO) => {
  const certifications = [];
  if (data.certificationId && Number(data.certificationId) > 0) {
    certifications.push({
      certificationId: String(data.certificationId),
      certificationStartDate: data.certificationStartDate?.replaceAll('-', '/'),
      certificationEndDate: data.certificationEndDate?.replaceAll('-', '/'),
      employeeCertificationScore: data.certificationScore,
    });
  }

  return {
    ...data,
    employeeBirthDate: data.employeeBirthDate?.replaceAll('-', '/'),
    certifications,
  };
};

export const employeeApi = {
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
  getEmployeeById: async (id: string | number) => {
    const response = await apiClient.get<EmployeeDetailResponse>(`/api/employee/${id}`);
    return response.data;
  },

  /**
   * Thêm mới nhân viên
   */
  createEmployee: async (data: EmployeeFormDTO) => {
    const payload = toEmployeeRequest(data);
    const response = await apiClient.post('/api/employee', payload);
    return response.data;
  },

  /**
   * Validate dữ liệu nhân viên trước khi confirm
   */
  validateEmployee: async (data: EmployeeFormDTO) => {
    const payload = toEmployeeRequest(data);
    const response = await apiClient.post('/api/employee/validate', payload);
    return response.data;
  },

  /**
   * Cập nhật thông tin nhân viên
   */
  updateEmployee: async (data: EmployeeFormDTO) => {
    const payload = toEmployeeRequest(data);
    const response = await apiClient.put(`/api/employee`, payload);
    return response.data;
  },

  /**
   * (ADM003) API xóa nhân viên theo ID.
   * DELETE /api/employee/{id}
   */
  deleteEmployee: async (id: number) => {
    const response = await apiClient.delete(`/api/employee/${id}`);
    return response.data;
  },
};
