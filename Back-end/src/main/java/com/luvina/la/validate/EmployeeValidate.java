/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeValidate.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.validate;

import com.luvina.la.constant.AppConstants;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.EmployeeRequest.CertificationRequest;
import com.luvina.la.payload.MessageResponse;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.ArrayList;
import java.util.List;

/**
 * Lớp tiện ích thực hiện kiểm tra các quy tắc nghiệp vụ (Business Rules).
 * Tập trung toàn bộ logic kiểm tra dữ liệu của màn hình ADM004 tại đây.
 * 
 * @author Nguyen Huy Hoang
 */
public class EmployeeValidate {

    private EmployeeValidate() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Hàm tổng kiểm tra toàn bộ Form nhân viên.
     * 
     * @param request   Dữ liệu từ Client
     * @param isAddMode True nếu là thêm mới, False nếu là cập nhật
     * @param deptRepo  Truy vấn phòng ban
     * @param certRepo  Truy vấn chứng chỉ
     * @param empRepo   Truy vấn nhân viên (để check trùng ID)
     * @return Danh sách các thông báo lỗi (MessageResponse)
     */
    public static List<MessageResponse> validateEmployeeForm(
            EmployeeRequest request,
            boolean isAddMode,
            DepartmentRepository deptRepo,
            CertificationRepository certRepo,
            EmployeeRepository empRepo) {

        List<MessageResponse> errors = new ArrayList<>();

        // 1. Kiểm tra Login ID (ER001, ER006, ER019, ER003)
        validateLoginId(request.getEmployeeLoginId(), isAddMode, empRepo, errors);

        // 2. Kiểm tra Họ tên (ER001, ER006)
        validateRequiredAndLength(request.getEmployeeName(), AppConstants.LABEL_NAME, AppConstants.MAX_LENGTH_NAME,
                errors);

        // 3. Kiểm tra Tên Kana (ER001, ER006, ER009)
        validateNameKana(request.getEmployeeNameKana(), errors);

        // 4. Kiểm tra Ngày sinh (ER001, ER005, ER011)
        validateDate(request.getEmployeeBirthDate(), AppConstants.LABEL_BIRTH_DATE, errors);

        // 5. Kiểm tra Email (ER001, ER006, ER005)
        validateEmail(request.getEmployeeEmail(), errors);

        // 6. Kiểm tra Số điện thoại (ER001, ER006, ER008)
        validateTelephone(request.getEmployeeTelephone(), errors);

        // 7. Kiểm tra Mật khẩu (Chỉ bắt buộc ở chế độ Add)
        validatePassword(request.getEmployeeLoginPassword(), request.getEmployeeLoginPasswordConfirm(), isAddMode,
                errors);

        // 8. Kiểm tra Phòng ban (ER002, ER004)
        validateDepartment(request.getDepartmentId(), deptRepo, errors);

        // 9. Kiểm tra danh sách chứng chỉ (Nếu có)
        if (request.getCertifications() != null && !request.getCertifications().isEmpty()) {
            for (EmployeeRequest.CertificationRequest certReq : request.getCertifications()) {
                validateCertification(certReq, certRepo, errors);
            }
        }

        return errors;
    }

    // ── Chi tiết từng hạng mục kiểm tra ──────────────────────────────────────

    // Validate login id
    private static void validateLoginId(String loginId, boolean isAddMode, EmployeeRepository empRepo,
            List<MessageResponse> errors) {
        if (isEmpty(loginId)) {
            errors.add(buildMessage(AppConstants.ER001, AppConstants.LABEL_LOGIN_ID));
        } else if (loginId.length() > AppConstants.MAX_LENGTH_LOGIN_ID) {
            errors.add(buildMessage(AppConstants.ER006, AppConstants.LABEL_LOGIN_ID));
        } else if (!loginId.matches("^[a-zA-Z][a-zA-Z0-9_]*$")) {
            errors.add(buildMessage(AppConstants.ER019, AppConstants.LABEL_LOGIN_ID));
        } else if (isAddMode && empRepo.existsByEmployeeLoginId(loginId)) {
            errors.add(buildMessage(AppConstants.ER003, AppConstants.LABEL_LOGIN_ID));
        }
    }

    // Validate tên Kana
    private static void validateNameKana(String nameKana, List<MessageResponse> errors) {
        if (isEmpty(nameKana)) {
            errors.add(buildMessage(AppConstants.ER001, AppConstants.LABEL_NAME_KANA));
        } else if (nameKana.length() > AppConstants.MAX_LENGTH_NAME_KANA) {
            errors.add(buildMessage(AppConstants.ER006, AppConstants.LABEL_NAME_KANA));
        } else if (!nameKana.matches("^[\\u30A0-\\u30FF]+$")) {
            errors.add(buildMessage(AppConstants.ER009, AppConstants.LABEL_NAME_KANA));
        }
    }

    // Validate email
    private static void validateEmail(String email, List<MessageResponse> errors) {
        if (isEmpty(email)) {
            errors.add(buildMessage(AppConstants.ER001, AppConstants.LABEL_EMAIL));
        } else if (email.length() > AppConstants.MAX_LENGTH_EMAIL) {
            errors.add(buildMessage(AppConstants.ER006, AppConstants.LABEL_EMAIL));
        } else if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            errors.add(buildMessage(AppConstants.ER005, AppConstants.LABEL_EMAIL));
        }
    }

    // Validate số điện thoại
    private static void validateTelephone(String tel, List<MessageResponse> errors) {
        if (isEmpty(tel)) {
            errors.add(buildMessage(AppConstants.ER001, AppConstants.LABEL_TELEPHONE));
        } else if (tel.length() > AppConstants.MAX_LENGTH_TELEPHONE) {
            errors.add(buildMessage(AppConstants.ER006, AppConstants.LABEL_TELEPHONE));
        } else if (!tel.matches("^[\\x00-\\x7F]+$")) { // Kiểm tra ký tự 1 byte (Half-size)
            errors.add(buildMessage(AppConstants.ER008, AppConstants.LABEL_TELEPHONE));
        }
    }

    // Validate mật khẩu
    private static void validatePassword(String pass, String confirm, boolean isAddMode, List<MessageResponse> errors) {
        if (isAddMode) {
            if (isEmpty(pass)) {
                errors.add(buildMessage(AppConstants.ER001, AppConstants.LABEL_PASSWORD));
            } else if (pass.length() < AppConstants.MIN_LENGTH_PASSWORD
                    || pass.length() > AppConstants.MAX_LENGTH_PASSWORD) {
                errors.add(buildMessage(AppConstants.ER007, AppConstants.LABEL_PASSWORD, "8", "50"));
            }
        }

        if (!isEmpty(pass) && !pass.equals(confirm)) {
            errors.add(buildMessage(AppConstants.ER017, AppConstants.LABEL_PASSWORD_CONFIRM));
        }
    }

    // Validate phòng ban
    private static void validateDepartment(Long deptId, DepartmentRepository deptRepo, List<MessageResponse> errors) {
        if (deptId == null) {
            errors.add(buildMessage(AppConstants.ER002, AppConstants.LABEL_DEPARTMENT));
        } else if (!deptRepo.existsById(deptId)) {
            errors.add(buildMessage(AppConstants.ER004, AppConstants.LABEL_DEPARTMENT));
        }
    }

    // Validate chứng chỉ
    private static void validateCertification(EmployeeRequest.CertificationRequest certReq,
            CertificationRepository certRepo, List<MessageResponse> errors) {
        String certIdStr = certReq.getCertificationId();
        if (isEmpty(certIdStr)) {
            errors.add(buildMessage(AppConstants.ER002, AppConstants.LABEL_CERTIFICATION));
        } else {
            try {
                Long certId = Long.parseLong(certIdStr);
                if (!certRepo.existsById(certId)) {
                    errors.add(buildMessage(AppConstants.ER004, AppConstants.LABEL_CERTIFICATION));
                }
            } catch (NumberFormatException e) {
                errors.add(buildMessage(AppConstants.ER018, AppConstants.LABEL_CERTIFICATION));
            }
        }

        // Kiểm tra ngày cấp và ngày hết hạn
        validateDate(certReq.getCertificationStartDate(), AppConstants.LABEL_CERT_START_DATE, errors);
        validateDate(certReq.getCertificationEndDate(), AppConstants.LABEL_CERT_END_DATE, errors);

        // So sánh ngày
        if (isValidFormat(certReq.getCertificationStartDate()) && isValidFormat(certReq.getCertificationEndDate())) {
            LocalDate start = parseDate(certReq.getCertificationStartDate());
            LocalDate end = parseDate(certReq.getCertificationEndDate());
            if (start != null && end != null && end.isBefore(start)) {
                errors.add(buildMessage(AppConstants.ER012));
            }
        }

        // Kiểm tra điểm số
        String score = certReq.getEmployeeCertificationScore();
        if (isEmpty(score)) {
            errors.add(buildMessage(AppConstants.ER001, AppConstants.LABEL_CERT_SCORE));
        } else if (!score.matches("^[0-9]+$")) {
            errors.add(buildMessage(AppConstants.ER018, AppConstants.LABEL_CERT_SCORE));
        }
    }

    /**
     * Kiểm tra ngày tháng với 2 cấp độ: Định dạng (ER005) và Thực tế (ER011).
     */
    private static void validateDate(String dateStr, String label, List<MessageResponse> errors) {
        if (isEmpty(dateStr)) {
            errors.add(buildMessage(AppConstants.ER001, label));
            return;
        }

        // 1. Kiểm tra định dạng yyyy/MM/dd
        if (!dateStr.matches("^\\d{4}/\\d{2}/\\d{2}$")) {
            errors.add(buildMessage(AppConstants.ER005, label, AppConstants.DATE_FORMAT));
            return;
        }

        // 2. Kiểm tra ngày có thực không
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT)
                    .withResolverStyle(ResolverStyle.STRICT);
            LocalDate.parse(dateStr, dtf);
        } catch (DateTimeParseException e) {
            errors.add(buildMessage(AppConstants.ER011, label));
        }
    }

    // ── Hàm tiện ích ───────────────────────────────────────

    // Validate độ dài và bắt buộc
    private static void validateRequiredAndLength(String value, String label, int max, List<MessageResponse> errors) {
        if (isEmpty(value)) {
            errors.add(buildMessage(AppConstants.ER001, label));
        } else if (value.length() > max) {
            errors.add(buildMessage(AppConstants.ER006, label));
        }
    }

    // Kiểm tra rỗng
    private static boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    // Kiểm tra định dạng ngày
    private static boolean isValidFormat(String dateStr) {
        return dateStr != null && dateStr.matches("^\\d{4}/\\d{2}/\\d{2}$");
    }

    // Parse ngày
    private static LocalDate parseDate(String dateStr) {
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT));
        } catch (Exception e) {
            return null;
        }
    }

    // Tạo message response
    private static MessageResponse buildMessage(String code, Object... params) {
        return new MessageResponse(code, List.of(params));
    }

    // Kiểm tra sort
    public static boolean isValidSort(String sort) {
        return AppConstants.SORT_ASC.equalsIgnoreCase(sort) || AppConstants.SORT_DESC.equalsIgnoreCase(sort);
    }
}
