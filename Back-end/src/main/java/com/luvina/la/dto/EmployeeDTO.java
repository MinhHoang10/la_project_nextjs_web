/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeDTO.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * Đối tượng Truyền tải Dữ liệu (DTO) tổng hợp toàn bộ thông tin về Nhân viên.
 * Dùng để luân chuyển dữ liệu giữa các lớp (Controller, Service, Repository) 
 * và trả về kết quả cuối cùng cho phía Frontend.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO implements Serializable {

    private static final long serialVersionUID = 6868189362900231672L;

    // ===== Thông tin cơ bản của nhân viên =====

    /** Mã số định danh nhân viên (Khóa chính) */
    private Long employeeId;

    /** Tên tài khoản đăng nhập (Dùng để xác thực hệ thống) */
    @NotBlank(message = "ER001")
    @Size(max = 50, message = "ER006")
    @Pattern(regexp = "^[a-zA-Z_][a-zA-Z0-9_]*$", message = "ER019")
    private String employeeLoginId;

    /** Họ và tên hiển thị */
    @NotBlank(message = "ER001")
    @Size(max = 125, message = "ER006")
    private String employeeName;

    /** Họ tên phiên âm (Katakana) */
    @NotBlank(message = "ER001")
    @Size(max = 125, message = "ER006")
    @Pattern(regexp = "^[ァ-ンヴー]+$", message = "ER009")
    private String employeeNameKana;

    /** Ngày tháng năm sinh */
    private LocalDate employeeBirthDate;

    /** Địa chỉ hòm thư điện tử */
    @NotBlank(message = "ER001")
    @Size(max = 125, message = "ER006")
    private String employeeEmail;

    /** Số điện thoại liên lạc */
    @NotBlank(message = "ER001")
    @Size(max = 50, message = "ER006")
    @Pattern(regexp = "^[0-9]+$", message = "ER018")
    private String employeeTelephone;

    /** Mật khẩu truy cập (Thường chỉ dùng cho nghiệp vụ thêm/sửa, trả về rỗng khi lấy danh sách) */
    @Size(max = 50, message = "ER006")
    private String employeeLoginPassword;

    // ===== Thông tin về đơn vị công tác (Lấy từ bảng Departments) =====

    /** Mã số định danh phòng ban */
    private Long departmentId;

    /** Tên gọi của phòng ban/bộ phận */
    private String departmentName;

    // ===== Thông tin về chứng chỉ ngoại ngữ (Lấy từ bảng Certifications) =====

    /** Mã số chứng chỉ mà nhân viên đang sở hữu (Bảng trung gian) */
    private Long employeeCertificationId;

    /** Mã số định danh loại chứng chỉ */
    private Long certificationId;

    /** Tên loại chứng chỉ năng lực */
    private String certificationName;

    /** Ngày nhân viên bắt đầu được cấp chứng chỉ */
    private LocalDate certificationStartDate;

    /** Ngày chứng chỉ hết giá trị hiệu lực */
    private LocalDate certificationEndDate;

    /** Điểm số đạt được trong kỳ thi chứng chỉ */
    private BigDecimal certificationScore;

}
