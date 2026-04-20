/**
 * Copyright(C) 2026 Luvina Software Company
 * employee.ts, 4/13/2026 NguyenHuyHoang
 */
import { DepartmentDTO } from './department';
import { EmployeeCertificationDTO } from './employees-certifications';

/**
 * Lớp Types ánh xạ trực tiếp với EmployeeDTO trên Java Backend.
 * Dùng làm mỏ neo cố định các trường hiển thị List và Detail.
 * Kết hợp thông tin từ Phòng ban và Chứng chỉ (Flattened structure).
 */
export interface EmployeeDTO extends EmployeeCertificationDTO {
  employeeId?: number;
  employeeLoginId?: string;
  employeeName?: string;
  employeeNameKana?: string;
  employeeBirthDate?: string; // Định dạng chuẩn YYYY-MM-DD
  employeeEmail?: string;
  employeeTelephone?: string;
  employeeLoginPassword?: string;

  // Thuộc tính join phòng ban
  departmentId?: number;
  departmentName?: string;
}

/**
 * Định dạng bọc PageResponse của Spring Data JPA gửi xuống Client.
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * Lớp cấu trúc trả về chuẩn cho API danh sách nhân viên từ Backend
 */
export interface EmployeeListResponse {
  code: string;
  totalRecords: number;
  message?: string;
  params?: string[];
  employees: EmployeeDTO[];
}

/**
 * Struct Query parameters lúc fetch list nhân sự.
 */
export interface EmployeeSearchParams {
  name?: string;
  departmentId?: number;
  certificationId?: number;
  page?: number;     // Vị trí trang
  size?: number;     // Số Limit mỗi trang
  sort?: string | string[]; // Dãy thuộc tính muốn SORT
}
