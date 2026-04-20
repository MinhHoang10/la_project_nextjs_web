/**
 * Copyright(C) 2026 Luvina Software Company
 * departmentService.ts, 4/13/2026 NguyenHuyHoang
 */
import { apiClient } from './client';
import { DepartmentDTO } from '@/types/department';

/**
 * Khối tiện ích (Service) bọc lại tập hợp các API liên quan đến Phòng Ban.
 */
export const departmentApi = {
  /**
   * Gọi GET đến /api/departments lấy toàn bộ danh sách phòng ban.
   * Dùng để đổ dữ liệu vào thẻ <select> trên giao diện trang Chủ.
   */
  getAllDepartments: async () => {
    const response = await apiClient.get<DepartmentDTO[]>('/department');
    return response.data;
  },
};
