/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeServiceImpl.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service.impl;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.Employee;
import com.luvina.la.constant.AppConstants;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import java.util.List;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Lớp triển khai các dịch vụ nghiệp vụ liên quan đến nhân viên.
 * Chịu trách nhiệm xử lý logic, tính toán phân trang và gọi lớp Repository để truy xuất dữ liệu.
 * 
 * @author Nguyen Huy Hoang
 */
@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Thực hiện đếm số lượng nhân viên thỏa mãn tiêu chí tìm kiếm bằng cách gọi Repository.
     */
    @Override
    @Transactional(readOnly = true)
    public Long countEmployeesWithFilter(String employeeName, Long departmentId) {
        return employeeRepository.countEmployeesWithFilter(employeeName, departmentId);
    }

    /**
     * Xử lý lấy danh sách nhân viên kết hợp các quy tắc về sắp xếp phức tạp và tính toán phân trang.
     * Hỗ trợ sắp xếp đa cột (Multi-column sorting) thông qua JpaSort.
     */
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getListEmployee(String employeeName, Long departmentId, String sortEmployeeName,
            String sortCertificationName, String sortEndDate, Integer limit, Integer offset) {
        
        // 1. Khởi tạo đối tượng sắp xếp dựa trên các tham số ưu tiên
        // Ưu tiên 1: Sắp xếp theo Tên nhân viên
        JpaSort sort = JpaSort.unsafe(
                AppConstants.SORT_DESC.equalsIgnoreCase(sortEmployeeName) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "employeeName");

        // Ưu tiên 2: Sắp xếp theo Cấp độ chứng chỉ
        sort = sort.andUnsafe(
                AppConstants.SORT_DESC.equalsIgnoreCase(sortCertificationName) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "c.certificationLevel");

        // Ưu tiên 3: Sắp xếp theo Ngày hết hạn chứng chỉ
        sort = sort.andUnsafe(
                AppConstants.SORT_DESC.equalsIgnoreCase(sortEndDate) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "ec.endDate");

        // 2. Thiết lập cấu hình phân trang an toàn
        int limitSafe = (limit != null && limit > 0) ? limit : AppConstants.DEFAULT_LIMIT;
        int offsetSafe = (offset != null && offset >= 0) ? offset : 0;
        
        // Chuyển đổi offset sang số trang (Page number) cho Spring Data
        int pageNo = offsetSafe / limitSafe;
        Pageable pageable = PageRequest.of(pageNo, limitSafe, sort);

        // 3. Thực hiện truy vấn thông qua Repository
        return employeeRepository.findEmployeesWithFilter(employeeName, departmentId, pageable);
    }

    /**
     * Truy xuất và map thông tin của một nhân viên sang DTO.
     */
    @Override
    @Transactional(readOnly = true)
    public EmployeeDTO getEmployeeById(Long id) {
        return employeeRepository.findEmployeeDTOById(id).orElse(null);
    }
}
