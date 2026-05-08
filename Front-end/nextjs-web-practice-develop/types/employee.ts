/**
 * Copyright(C) 2026 Luvina Software Company
 * employee.ts, 4/13/2026 NguyenHuyHoang
 */
import { DepartmentDTO } from './department';
import { EmployeeCertificationDTO } from './employees-certifications';

/**
 * Lớp Types ánh xạ trực tiếp với EmployeeDTO trên Java Backend.
 * Dùng để cố định các trường hiển thị List và Detail.
 * Kết hợp thông tin từ Phòng ban và Chứng chỉ.
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

export interface CertificationDetail {
  certificationId?: number;
  certificationName?: string;
  startDate?: string;
  endDate?: string;
  score?: number;
}

/**
 * Lớp cấu trúc trả về cho API chi tiết nhân viên (ADM003)
 */
export interface EmployeeDetailResponse {
  code: number;
  employeeId?: number;
  employeeName?: string;
  employeeBirthDate?: string;
  departmentId?: number;
  departmentName?: string;
  employeeEmail?: string;
  employeeTelephone?: string;
  employeeNameKana?: string;
  employeeLoginId?: string;
  certifications?: CertificationDetail[];
}

/**
 * Wrapper response từ API GET /employee/{id} sau khi bọc trong EmployeeResponse
 */
export interface EmployeeDetailApiResponse {
  code: string;
  detail: EmployeeDetailResponse;
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

/**
 * Interface dành riêng cho Form nhập liệu (ADM004) và xác nhận (ADM005).
 */
export interface EmployeeFormDTO extends EmployeeDTO {
  employeeLoginPasswordConfirm?: string;
}

/** Đối tượng lỗi cho mỗi trường trong form */
export interface FieldErrors {
  [key: string]: string | undefined;
  employeeLoginId?: string;
  departmentId?: string;
  employeeName?: string;
  employeeNameKana?: string;
  employeeBirthDate?: string;
  employeeEmail?: string;
  employeeTelephone?: string;
  employeeLoginPassword?: string;
  employeeLoginPasswordConfirm?: string;
  certificationId?: string;
  certificationStartDate?: string;
  certificationEndDate?: string;
  certificationScore?: string;
}
