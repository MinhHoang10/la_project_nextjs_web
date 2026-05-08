/**
 * Copyright(C) 2026 Luvina Software Company
 * employeeService.ts, 4/13/2026 NguyenHuyHoang
 */
import { apiClient } from './client';
import { EmployeeListResponse, EmployeeSearchParams, EmployeeFormDTO, EmployeeDetailResponse, EmployeeDetailApiResponse } from '@/types/employee';

/**
 * Hàm trợ giúp để chuyển đổi định dạng dữ liệu từ Frontend Form sang cấu trúc yêu cầu của Backend.
 *
 * @param data - Đối tượng EmployeeFormDTO chứa dữ liệu nhập từ màn hình giao diện (ADM004)
 * @returns Đối tượng đã được định dạng lại, sẵn sàng gửi lên API backend
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
   * Lấy danh sách nhân viên theo bộ tham số tìm kiếm và phân trang (ADM002).
   *
   * @param params - Bộ tham số tìm kiếm bao gồm tên, phòng ban, phân trang và sắp xếp
   * @return Promise chứa danh sách nhân viên và tổng số bản ghi
   */
  getAllEmployees: async (params: EmployeeSearchParams): Promise<EmployeeListResponse> => {
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
   * Lấy thông tin chi tiết của một nhân viên theo ID (ADM003).
   *
   * @param id - Mã định danh nhân viên cần truy vấn
   * @return Promise chứa thông tin chi tiết nhân viên bao gồm danh sách chứng chỉ
   */
  getEmployeeById: async (id: string | number): Promise<EmployeeDetailResponse> => {
    const response = await apiClient.get<EmployeeDetailApiResponse>(`/api/employee/${id}`);
    // Backend bọc dữ liệu chi tiết trong field 'detail' của EmployeeResponse
    return response.data.detail;
  },

  /**
   * Gửi yêu cầu thêm mới nhân viên lên backend (ADM004 - Add).
   *
   * @param data - Dữ liệu form nhân viên từ màn hình nhập liệu
   * @return Promise chứa kết quả phản hồi từ backend (mã trạng thái và ID nhân viên mới)
   */
  createEmployee: async (data: EmployeeFormDTO) => {
    const payload = toEmployeeRequest(data);
    const response = await apiClient.post('/api/employee', payload);
    return response.data;
  },

  /**
   * Gửi yêu cầu validate dữ liệu nhân viên trước khi chuyển sang màn hình xác nhận (ADM005).
   * Chỉ kiểm tra logic nghiệp vụ (trùng LoginId, tồn tại phòng ban...) mà không lưu dữ liệu.
   *
   * @param data - Dữ liệu form nhân viên cần kiểm tra
   * @return Promise chứa kết quả validate từ backend (200 nếu hợp lệ, 400 nếu có lỗi)
   */
  validateEmployee: async (data: EmployeeFormDTO) => {
    const payload = toEmployeeRequest(data);
    const response = await apiClient.post('/api/employee/validate', payload);
    return response.data;
  },

  /**
   * Gửi yêu cầu cập nhật thông tin nhân viên đã tồn tại (ADM004 - Edit).
   *
   * @param data - Dữ liệu form nhân viên đã chỉnh sửa, bao gồm employeeId
   * @return Promise chứa kết quả phản hồi từ backend
   */
  updateEmployee: async (data: EmployeeFormDTO) => {
    const payload = toEmployeeRequest(data);
    const response = await apiClient.put(`/api/employee`, payload);
    return response.data;
  },

  /**
   * Gửi yêu cầu xóa nhân viên theo ID (ADM003).
   *
   * @param id - Mã định danh nhân viên cần xóa
   * @return Promise chứa kết quả phản hồi từ backend (mã trạng thái xác nhận đã xóa)
   */
  deleteEmployee: async (id: number) => {
    const response = await apiClient.delete(`/api/employee/${id}`);
    return response.data;
  },
};
