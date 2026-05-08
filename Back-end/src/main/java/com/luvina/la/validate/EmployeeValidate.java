/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeValidate.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.validate;

import com.luvina.la.constant.AppConstants;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.MessageResponse;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.util.ValidationUtils;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Lớp tiện ích thực hiện kiểm tra các quy tắc nghiệp vụ
 * 
 * @author Nguyen Huy Hoang
 */
public class EmployeeValidate {

    /**
     * Hàm kiểm tra dữ liệu Form nhân viên dành cho luồng lưu dữ liệu thực tế
     * (Add/Update).
     * 
     * @param request                 Dữ liệu nhân viên từ client
     * @param isAddMode               True nếu là thêm mới, False nếu là cập nhật
     * @param departmentRepository    Repository truy vấn phòng ban
     * @param certificationRepository Repository truy vấn chứng chỉ
     * @param employeeRepository      Repository truy vấn nhân viên
     * @return Danh sách các thông báo lỗi (MessageResponse)
     */
    public static List<MessageResponse> validateEmployeeForm(
            EmployeeRequest request,
            boolean isAddMode,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeRepository employeeRepository) {

        List<MessageResponse> errors = new ArrayList<>();

        // 1. Kiểm tra Employee ID (chỉ dành cho Edit)
        if (!isAddMode) {
            validateEmployeeId(request.getEmployeeId(), employeeRepository, errors);
        }

        // 2. Kiểm tra các trường chung
        validateCommonFields(request, isAddMode, departmentRepository, certificationRepository, employeeRepository,
                errors);

        // 3. Kiểm tra Mật khẩu
        validatePassword(request.getEmployeeLoginPassword(), request.getEmployeeLoginPasswordConfirm(), isAddMode,
                errors);

        return errors;
    }

    /**
     * Hàm kiểm tra dữ liệu Form nhân viên dành riêng cho API xác nhận (ADM005).
     * 
     * @param request                 Dữ liệu nhân viên từ client
     * @param isAddMode               True nếu là thêm mới, False nếu là cập nhật
     * @param departmentRepository    Repository truy vấn phòng ban
     * @param certificationRepository Repository truy vấn chứng chỉ
     * @param employeeRepository      Repository truy vấn nhân viên
     * @return Danh sách các thông báo lỗi
     */
    public static List<MessageResponse> validateEmployeeFormForConfirm(
            EmployeeRequest request,
            boolean isAddMode,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeRepository employeeRepository) {

        List<MessageResponse> errors = new ArrayList<>();

        // Đối với API validate, chỉ kiểm tra các trường chung, bỏ qua Password và
        // EmployeeID tồn tại
        validateCommonFields(request, isAddMode, departmentRepository, certificationRepository, employeeRepository,
                errors);

        return errors;
    }

    /**
     * Tập hợp các quy tắc kiểm tra chung cho cả hai luồng (Xác nhận và Lưu).
     */
    private static void validateCommonFields(
            EmployeeRequest request,
            boolean isAddMode,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeRepository employeeRepository,
            List<MessageResponse> errors) {

        // 1. Kiểm tra Login ID (ER001, ER006, ER019, ER003)
        validateLoginId(request.getEmployeeLoginId(), request.getEmployeeId(), isAddMode, employeeRepository, errors);

        // 2. Kiểm tra Họ tên (ER001, ER006)
        ValidationUtils.validateRequiredAndLength(request.getEmployeeName(), AppConstants.LABEL_NAME,
                AppConstants.MAX_LENGTH_NAME,
                errors);

        // 3. Kiểm tra Tên Kana (ER001, ER006, ER009)
        validateNameKana(request.getEmployeeNameKana(), errors);

        // 4. Kiểm tra Ngày sinh (ER001, ER005, ER011)
        ValidationUtils.validateDate(request.getEmployeeBirthDate(), AppConstants.LABEL_BIRTH_DATE, errors);

        // 5. Kiểm tra Email (ER001, ER006, ER005)
        validateEmail(request.getEmployeeEmail(), errors);

        // 6. Kiểm tra Số điện thoại (ER001, ER006, ER008)
        validateTelephone(request.getEmployeeTelephone(), errors);

        // 7. Kiểm tra Phòng ban (ER002, ER004)
        validateDepartment(request.getDepartmentId(), departmentRepository, errors);

        // 8. Kiểm tra danh sách chứng chỉ (Nếu có)
        if (request.getCertifications() != null && !request.getCertifications().isEmpty()) {
            for (EmployeeRequest.CertificationRequest certificationRequest : request.getCertifications()) {
                validateCertification(certificationRequest, certificationRepository, errors);
            }
        }
    }

    /**
     * Validate Employee ID cho chế độ Edit.
     * 
     * @param employeeId
     * @param employeeRepository
     * @param errors
     */
    private static void validateEmployeeId(Long employeeId, EmployeeRepository employeeRepository,
            List<MessageResponse> errors) {
        // Kiểm tra thông tin Employee ID
        if (employeeId == null) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, " I D "));
            // Kiểm tra tồn tại Employee ID
        } else if (!employeeRepository.existsById(employeeId)) {
            throw new com.luvina.la.exception.LogicException(AppConstants.ER013, java.util.Arrays.asList(" I D "));
        }
    }

    /**
     * Validate Login ID.
     * 
     * @param loginId
     * @param currentEmployeeId
     * @param isAddMode
     * @param employeeRepository
     * @param errors
     */
    private static void validateLoginId(String loginId, Long currentEmployeeId, boolean isAddMode,
            EmployeeRepository employeeRepository,
            List<MessageResponse> errors) {
        // Kiểm tra thông tin đăng nhập
        if (ValidationUtils.isEmpty(loginId)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, AppConstants.LABEL_LOGIN_ID));
            // Kiểm tra độ dài Login ID
        } else if (loginId.length() > AppConstants.MAX_LENGTH_LOGIN_ID) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER006, AppConstants.LABEL_LOGIN_ID,
                    String.valueOf(AppConstants.MAX_LENGTH_LOGIN_ID)));
            // Kiểm tra định dạng Login ID
        } else if (!loginId.matches("^[a-zA-Z][a-zA-Z0-9_]*$")) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER019, AppConstants.LABEL_LOGIN_ID));
        } else {
            // Kiểm tra trùng lặp Login ID
            if (isAddMode) {
                // Kiểm tra trùng lặp Login ID khi add
                if (employeeRepository.existsByEmployeeLoginId(loginId)) {
                    errors.add(MessageResponse.buildMessage(AppConstants.ER003, AppConstants.LABEL_LOGIN_ID));
                }
                // Kiểm tra trùng lặp Login ID khi edit
            } else if (currentEmployeeId != null) {
                if (employeeRepository.findByEmployeeLoginIdAndEmployeeIdNot(loginId, currentEmployeeId).isPresent()) {
                    errors.add(MessageResponse.buildMessage(AppConstants.ER003, AppConstants.LABEL_LOGIN_ID));
                }
            }
        }
    }

    /**
     * Validate Name Kana (Half-size).
     * 
     * @param nameKana
     * @param errors
     */
    private static void validateNameKana(String nameKana, List<MessageResponse> errors) {
        // Kiểm tra thông tin tên nhân viên
        if (ValidationUtils.isEmpty(nameKana)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, AppConstants.LABEL_NAME_KANA));
            // Kiểm tra độ dài tên nhân viên
        } else if (nameKana.length() > AppConstants.MAX_LENGTH_NAME_KANA) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER006, AppConstants.LABEL_NAME_KANA,
                    String.valueOf(AppConstants.MAX_LENGTH_NAME_KANA)));
            // Kiểm tra định dạng tên nhân viên
        } else if (!nameKana.matches("^[\\uFF65-\\uFF9F]+$")) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER009, AppConstants.LABEL_NAME_KANA));
        }
    }

    /**
     * Validate Email.
     * 
     * @param email
     * @param errors
     */
    private static void validateEmail(String email, List<MessageResponse> errors) {
        // Kiểm tra thông tin email
        if (ValidationUtils.isEmpty(email)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, AppConstants.LABEL_EMAIL));
            // Kiểm tra độ dài email
        } else if (email.length() > AppConstants.MAX_LENGTH_EMAIL) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER006, AppConstants.LABEL_EMAIL,
                    String.valueOf(AppConstants.MAX_LENGTH_EMAIL)));
            // Kiểm tra định dạng email
        } else if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER005, AppConstants.LABEL_EMAIL));
        }
    }

    /**
     * Validate Telephone (Half-size).
     * 
     * @param tel
     * @param errors
     */
    private static void validateTelephone(String tel, List<MessageResponse> errors) {
        // Kiểm tra thông tin số điện thoại
        if (ValidationUtils.isEmpty(tel)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, AppConstants.LABEL_TELEPHONE));
            // Kiểm tra độ dài số điện thoại
        } else if (tel.length() > AppConstants.MAX_LENGTH_TELEPHONE) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER006, AppConstants.LABEL_TELEPHONE,
                    String.valueOf(AppConstants.MAX_LENGTH_TELEPHONE)));
            // Kiểm tra định dạng số điện thoại
        } else if (!tel.matches("^[\\x00-\\x7F]+$")) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER008, AppConstants.LABEL_TELEPHONE));
        }
    }

    /**
     * Validate Password.
     * 
     * @param pass
     * @param confirm
     * @param isAddMode
     * @param errors
     */
    private static void validatePassword(String pass, String confirm, boolean isAddMode, List<MessageResponse> errors) {
        // Kiểm tra mật khẩu
        if (isAddMode && ValidationUtils.isEmpty(pass)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, AppConstants.LABEL_PASSWORD));
        }
        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (!ValidationUtils.isEmpty(pass)) {
            if (pass.length() < AppConstants.MIN_LENGTH_PASSWORD
                    || pass.length() > AppConstants.MAX_LENGTH_PASSWORD) {
                errors.add(MessageResponse.buildMessage(AppConstants.ER007, AppConstants.LABEL_PASSWORD, "8", "50"));
            } else if (!pass.equals(confirm)) {
                errors.add(MessageResponse.buildMessage(AppConstants.ER017, AppConstants.LABEL_PASSWORD_CONFIRM));
            }
        }
    }

    /**
     * Validate Department.
     * 
     * @param departmentId
     * @param departmentRepository
     * @param errors
     */
    private static void validateDepartment(Long departmentId, DepartmentRepository departmentRepository,
            List<MessageResponse> errors) {
        // Kiểm tra thông tin phòng ban
        if (departmentId == null) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, AppConstants.LABEL_DEPARTMENT));
            // Kiểm tra tồn tại phòng ban
        } else if (!departmentRepository.existsById(departmentId)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER004, AppConstants.LABEL_DEPARTMENT));
        }
    }

    /**
     * Validate Certification.
     * 
     * @param certificationRequest
     * @param certificationRepository
     * @param errors
     */
    private static void validateCertification(EmployeeRequest.CertificationRequest certificationRequest,
            CertificationRepository certificationRepository, List<MessageResponse> errors) {
        String certificationIdStr = certificationRequest.getCertificationId();
        // Kiểm tra thông tin chứng chỉ
        if (ValidationUtils.isEmpty(certificationIdStr)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER002, AppConstants.LABEL_CERTIFICATION));
        } else {
            try {
                Long certId = Long.parseLong(certificationIdStr);
                // Kiểm tra tồn tại chứng chỉ
                if (!certificationRepository.existsById(certId)) {
                    errors.add(MessageResponse.buildMessage(AppConstants.ER004, AppConstants.LABEL_CERTIFICATION));
                }
                // Kiểm tra định dạng chứng chỉ
            } catch (NumberFormatException e) {
                errors.add(MessageResponse.buildMessage(AppConstants.ER018, AppConstants.LABEL_CERTIFICATION));
            }
        }

        // Kiểm tra ngày bắt đầu chứng chỉ
        ValidationUtils.validateDate(certificationRequest.getCertificationStartDate(),
                AppConstants.LABEL_CERT_START_DATE,
                errors);
        // Kiểm tra ngày kết thúc chứng chỉ
        ValidationUtils.validateDate(certificationRequest.getCertificationEndDate(), AppConstants.LABEL_CERT_END_DATE,
                errors);

        // Kiểm tra ngày kết thúc chứng chỉ có trước ngày bắt đầu chứng chỉ không
        if (ValidationUtils.isValidFormat(certificationRequest.getCertificationStartDate())
                && ValidationUtils.isValidFormat(certificationRequest.getCertificationEndDate())) {
            LocalDate start = ValidationUtils.parseDate(certificationRequest.getCertificationStartDate());
            LocalDate end = ValidationUtils.parseDate(certificationRequest.getCertificationEndDate());
            if (start != null && end != null && end.isBefore(start)) {
                errors.add(MessageResponse.buildMessage(AppConstants.ER012));
            }
        }

        // Kiểm tra điểm chứng chỉ
        String score = certificationRequest.getEmployeeCertificationScore();
        // Kiểm tra thông tin điểm chứng chỉ
        if (ValidationUtils.isEmpty(score)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, AppConstants.LABEL_CERT_SCORE));
            // Kiểm tra định dạng điểm chứng chỉ
        } else if (!score.matches("^[0-9]+$")) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER018, AppConstants.LABEL_CERT_SCORE));
        }
    }

}
