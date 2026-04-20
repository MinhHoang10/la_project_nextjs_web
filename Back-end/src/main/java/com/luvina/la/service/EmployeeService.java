/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeService.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service;

import com.luvina.la.dto.EmployeeDTO;
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
     * @param employeeName            Từ khóa tìm kiếm theo tên
     * @param departmentId            Mã định danh phòng ban
     * @param sortEmployeeName        Hướng sắp xếp theo tên (asc/desc)
     * @param sortCertificationName   Hướng sắp xếp theo tên chứng chỉ (asc/desc)
     * @param sortEndDate             Hướng sắp xếp theo ngày hết hạn (asc/desc)
     * @param limit                   Số lượng bản ghi tối đa trên một trang
     * @param offset                  Vị trí bắt đầu lấy dữ liệu
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
     * Truy xuất thông tin chi tiết của một nhân viên bằng ID.
     * 
     * @param id Mã định danh của nhân viên
     * @return DTO chứa thông tin chi tiết nhân viên
     */
    EmployeeDTO getEmployeeById(Long id);
}
