/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeesCertifications.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;

/**
 * Lớp Thực thể (Entity) đại diện cho bảng 'employees_certifications' trong cơ sở dữ liệu.
 * Đây là bảng trung gian xử lý quan hệ nhiều-nhiều (N-N) thông qua 2 kết nối N-1 giữa nhân viên và chứng chỉ.
 * 
 * @author Nguyen Huy Hoang
 */
@Entity
@Table(name = "employees_certifications")
@Data
public class EmployeesCertifications implements Serializable {

    private static final long serialVersionUID = 428675319012354678L;

    /** Khóa chính của bảng map (Tăng tự động) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_certification_id")
    private Long employeeCertificationId;

    /** Map thông tin nhân viên (Khóa ngoại) */
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    /** Map thông tin chứng chỉ (Khóa ngoại) */
    @ManyToOne
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    /** Ngày bắt đầu có hiệu lực của chứng chỉ đối với nhân viên này */
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /** Ngày hết hiệu lực của chứng chỉ */
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /** Điểm thi chứng chỉ */
    @Column(name = "score", precision = 10, scale = 2, nullable = false)
    private BigDecimal score;

}
