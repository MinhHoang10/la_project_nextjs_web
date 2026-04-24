/**
 * Copyright(C) 2026 Luvina Software Company
 * DepartmentService.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service;

import com.luvina.la.dto.DepartmentDTO;
import java.util.List;

/**
 * Giao diện định nghĩa các nghiệp vụ cung cấp cho phòng ban.
 * 
 * @author Nguyen Huy Hoang
 */
public interface DepartmentService {

    /**
     * Lấy danh sách toàn bộ phòng ban.
     * 
     * @return Danh sách các DepartmentDTO
     */
    List<DepartmentDTO> getAllDepartments();
}
