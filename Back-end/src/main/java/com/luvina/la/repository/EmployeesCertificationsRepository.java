/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeesCertificationsRepository.java, 4/22/2026 NguyenHuyHoang
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Employee;
import com.luvina.la.entity.EmployeesCertifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kho dữ liệu cho thực thể EmployeesCertifications.
 * Dùng để lưu trữ quan hệ n-n giữa Employee và Certification.
 * 
 * @author Nguyen Huy Hoang
 */
@Repository
public interface EmployeesCertificationsRepository extends JpaRepository<EmployeesCertifications, Long> {
    /**
     * Xóa tất cả các chứng chỉ liên kết với một nhân viên cụ thể.
     * Thường dùng khi cập nhật thông tin nhân viên (Xóa cũ - Thêm mới).
     */
    @Modifying
    @Transactional
    void deleteByEmployee(Employee employee);
}
