/**
 * Copyright(C) 2026 Luvina Software Company
 * CertificationRepository.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Giao diện tương tác cơ sở dữ liệu (Repository) cho đối tượng Certification.
 * Mở rộng JpaRepository để thừa hưởng các phương thức CRUD chuẩn của Spring Data JPA.
 * 
 * @author Nguyen Huy Hoang
 */
@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    
    /**
     * Lấy danh sách toàn bộ chứng chỉ, sắp xếp tăng dần theo cấp độ (Level 1, 2, 3...).
     * @return Danh sách thực thể chứng chỉ
     */
    @Query("SELECT c FROM Certification c ORDER BY c.certificationLevel ASC")
    List<Certification> findAllOrderByLevel();
}
