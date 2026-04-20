/**
 * Copyright(C) 2026 Luvina Software Company
 * DepartmentRepository.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Department;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Giao diện tương tác cơ sở dữ liệu (Repository) cho đối tượng Department.
 * 
 * @author Nguyen Huy Hoang
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    /**
     * Lấy toàn bộ danh sách phòng ban — dùng cho dropdown (グループ).
     * Spring Data JPA tự sinh câu lệnh: SELECT * FROM departments ORDER BY department_id ASC
     * @return Danh sách thực thể phòng ban
     */
    List<Department> findAllByOrderByDepartmentIdAsc();

}
