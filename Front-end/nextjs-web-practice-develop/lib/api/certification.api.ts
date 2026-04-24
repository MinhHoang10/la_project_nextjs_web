/**
 * Copyright(C) 2026 Luvina Software Company
 * certification.api.ts, 4/20/2026 NguyenHuyHoang
 */
import { apiClient } from './client';
import { CertificationDTO } from '@/types/certification';

/**
 * Khối tiện ích (Service) bọc lại tập hợp các API liên quan đến Chứng Chỉ (Certification).
 */
export const certificationApi = {
  /**
   * Gọi GET đến /certification lấy toàn bộ danh sách chứng chỉ tiếng Nhật.
   * Dùng để đổ dữ liệu vào thẻ <select> trên giao diện màn hình 004.
   */
  getAllCertifications: async () => {
    const response = await apiClient.get<CertificationDTO[]>('/api/certifications');
    return response.data;
  },
};
