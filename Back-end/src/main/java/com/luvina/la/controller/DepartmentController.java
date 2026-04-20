/**
 * Copyright(C) 2026 Luvina Software Company
 * DepartmentController.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.controller;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Controller xử lý các yêu cầu API liên quan đến Phòng Ban.
 * 
 * @author Nguyen Huy Hoang
 */
@RestController
@RequestMapping("/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * API trả về các Nhóm phòng ban có trong công ty dùng làm Dropdown menu.
     * URI đích: GET /api/departments
     * 
     * @return List dữ liệu dạng JSON.
     */
    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }
}
