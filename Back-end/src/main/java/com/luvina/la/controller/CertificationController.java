/**
 * Copyright(C) 2026 Luvina Software Company
 * CertificationController.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.controller;

import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.service.CertificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Controller xử lý các yêu cầu API liên quan đến Chứng chỉ.
 * 
 * @author Nguyen Huy Hoang
 */
@RestController
@RequestMapping("/certification")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    /**
     * API trả về Cấp độ chuyên môn tiếng Nhật dùng làm Dropdown menu.
     * URI đích: GET /api/certifications
     * 
     * @return List dữ liệu dạng JSON.
     */
    @GetMapping
    public ResponseEntity<List<CertificationDTO>> getAllCertifications() {
        return ResponseEntity.ok(certificationService.getAllCertifications());
    }
}
