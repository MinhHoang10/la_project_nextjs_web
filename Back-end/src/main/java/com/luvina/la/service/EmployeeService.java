/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeService.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeDetailResponse;
import com.luvina.la.payload.EmployeeRequest;

import java.util.List;

/**
 * Giao diện định nghĩa các nghiệp vụ liên quan đến quản lý nhân viên.
 * Đóng vai trò là cầu nối giữa lớp Controller và lớp Repository.
 * 
 * @author Nguyen Huy Hoang
 */
public interface EmployeeService {

    /**
     * Tính toán tổng số lượng nhân viên dựa trên bộ lọc tìm kiếm.
     * 
     * @param employeeName Tên nhân viên cần lọc
     * @param departmentId Mã phòng ban cần lọc
     * @return Số lượng nhân viên thỏa mãn điều kiện
     */
    Long countEmployeesWithFilter(String employeeName, Long departmentId);

    /**
     * Lấy danh sách nhân viên đã được phân trang và sắp xếp theo yêu cầu.
     * 
     * @param employeeName          Từ khóa tìm kiếm theo tên
     * @param departmentId          Mã định danh phòng ban
     * @param sortEmployeeName      Hướng sắp xếp theo tên (asc/desc)
     * @param sortCertificationName Hướng sắp xếp theo tên chứng chỉ (asc/desc)
     * @param sortEndDate           Hướng sắp xếp theo ngày hết hạn (asc/desc)
     * @param limit                 Số lượng bản ghi tối đa trên một trang
     * @param offset                Vị trí bắt đầu lấy dữ liệu
     * @return Danh sách các đối tượng EmployeeDTO chứa thông tin cần hiển thị
     */
    List<EmployeeDTO> getListEmployee(
            String employeeName,
            Long departmentId,
            String sortEmployeeName,
            String sortCertificationName,
            String sortEndDate,
            Integer limit,
            Integer offset);

    /**
     * Lấy thông tin chi tiết nhân viên theo ID phục vụ màn hình chi tiết hoặc edit.
     * 
     * @param id Mã định danh nhân viên
     * @return EmployeeDTO chứa thông tin chi tiết
     */
    EmployeeDTO getEmployeeById(Long id);

    /**
     * Lấy thông tin chi tiết nhân viên với định dạng API chuẩn (ADM003).
     * 
     * @param id Mã định danh nhân viên
     * @return EmployeeDetailResponse chứa thông tin chi tiết và danh sách chứng chỉ
     */
    EmployeeDetailResponse getEmployeeDetailById(Long id);

    /**
     * Thêm mới một nhân viên vào hệ thống.
     *
     * @param request Dữ liệu form từ client (đã pass validation)
     * @return ID của nhân viên vừa được tạo
     */
    Long addEmployee(EmployeeRequest request);

    /**
     * Cập nhật thông tin nhân viên trong hệ thống (ADM004).
     *
     * @param request Dữ liệu form từ client (đã qua bước validate)
     */
    void editEmployee(EmployeeRequest request);

    /**
     * Xóa nhân viên theo ID.
     * Cần xóa chứng chỉ tiếng Nhật trước khi xóa thông tin nhân viên.
     *
     * @param id ID của nhân viên cần xóa
     * @throws LogicException   nếu ID null hoặc không tồn tại
     * @throws RuntimeException nếu có lỗi trong quá trình xóa (để trigger rollback)
     */
    void deleteEmployee(Long id);
}
