/**
 * Copyright(C) 2026 Luvina Software Company
 * employees-certifications.ts, 4/13/2026 NguyenHuyHoang
 */

/**
 * Interface đại diện cho mối liên kết giữa Nhân viên và Chứng chỉ.
 * Tương ứng với bảng trung gian employees_certifications trong DB.
 */
export interface EmployeeCertificationDTO {
  employeeCertificationId?: number;
  certificationId?: number;
  certificationName?: string;
  certificationStartDate?: string;
  certificationEndDate?: string;
  certificationScore?: number;
}
