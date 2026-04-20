/**
 * Copyright(C) 2026 Luvina Software Company
 * DepartmentServiceImpl.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service.impl;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.mapper.DepartmentMapper;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Hiện thực chi tiết (Implementation) của dịch vụ Department.
 * 
 * @author Nguyen Huy Hoang
 */
@Service
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    /**
     * lấy danh sách phòng ban đổ về Client.
     */
    @Override
    public List<DepartmentDTO> getAllDepartments() {
        return DepartmentMapper.MAPPER.toDtoList(departmentRepository.findAll());
    }
}
