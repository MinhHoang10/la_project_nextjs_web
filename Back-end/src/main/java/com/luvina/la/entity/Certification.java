/**
 * Copyright(C) 2026 Luvina Software Company
 * Certification.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * Lớp Thực thể (Entity) đại diện cho bảng chứng chỉ 'certifications' trong cơ sở dữ liệu.
 * 
 * @author Nguyen Huy Hoang
 */
@Entity
@Table(name = "certifications")
@Data
public class Certification implements Serializable {

    private static final long serialVersionUID = -368523784152631024L;

    /** Khóa chính của chứng chỉ (Tăng tự động) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id")
    private Long certificationId;

    /** Tên của chứng chỉ (Ví dụ: JLPT N1, AWS Practitioner...) */
    @Column(name = "certification_name", length = 50, nullable = false)
    private String certificationName;

    /** Cấp độ của chứng chỉ */
    @Column(name = "certification_level", nullable = false)
    private Integer certificationLevel;

}
