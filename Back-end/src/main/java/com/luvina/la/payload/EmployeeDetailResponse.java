/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeDetailResponse.java, 4/28/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

/**
 * Payload trả về thông tin chi tiết của một nhân viên (ADM003).
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class EmployeeDetailResponse {

    private Integer code;
    private Long employeeId;
    private String employeeName;
    private String employeeBirthDate;
    private Long departmentId;
    private String departmentName;
    private String employeeEmail;
    private String employeeTelephone;
    private String employeeNameKana;
    private String employeeLoginId;
    
    private List<CertificationDetail> certifications;
    
    /**
     * DTO nội bộ chứa thông tin chứng chỉ của nhân viên
     */
    @Data
    public static class CertificationDetail {
        private Long certificationId;
        private String certificationName;
        private String startDate;
        private String endDate;
        private BigDecimal score;
    }
}
