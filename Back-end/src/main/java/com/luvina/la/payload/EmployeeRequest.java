/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeRequest.java, 4/24/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import lombok.Data;
import java.util.List;

/**
 * DTO nhận dữ liệu yêu cầu từ client cho nghiệp vụ Nhân viên.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class EmployeeRequest {

    private Long employeeId;
    private String employeeLoginId;
    private String employeeName;
    private String employeeNameKana;
    private String employeeBirthDate;
    private String employeeEmail;
    private String employeeTelephone;
    private String employeeLoginPassword;
    private String employeeLoginPasswordConfirm;
    private Long departmentId;

    /** Mảng danh sách chứng chỉ */
    private List<CertificationRequest> certifications;

    public List<CertificationRequest> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<CertificationRequest> certifications) {
        this.certifications = certifications;
    }

    /**
     * Lớp đại diện cho thông tin một chứng chỉ trong mảng.
     */
    @Data
    public static class CertificationRequest {
        private String certificationId;
        private String certificationStartDate;
        private String certificationEndDate;
        private String employeeCertificationScore;
    }
}
