/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeController.java, 4/13/2026, NguyenHuyHoang
 */

package com.luvina.la.controller;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.dto.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import com.luvina.la.constant.AppConstants;
import com.luvina.la.validate.EmployeeValidation;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Controller xử lý các yêu cầu HTTP liên quan đến nghiệp vụ Nhân viên.
 * Đóng vai trò là điểm tiếp nhận cho các yêu cầu từ phía Frontend.
 * 
 * @author Nguyen Huy Hoang
 */
@RestController
@RequestMapping("/api")
@Slf4j
public class EmployeeController {

    private final EmployeeService employeeService;
    private final MessageSource messageSource;

    /**
     * Khởi tạo Controller với các phụ thuộc.
     *
     * @param employeeService Dịch vụ xử lý nghiệp vụ nhân viên
     * @param messageSource   Nguồn tài nguyên thông báo
     */
    public EmployeeController(EmployeeService employeeService, MessageSource messageSource) {
        this.employeeService = employeeService;
        this.messageSource = messageSource;
    }

    /**
     * API lấy danh sách nhân viên kết hợp bộ lọc tìm kiếm và phân trang (ADM002).
     * Chỉ trả về danh sách những nhân viên có vai trò là người dùng thường
     * (userRole = 0).
     * 
     * @param employeeName          Tên nhân viên
     * @param departmentId          Mã phòng ban
     * @param sortEmployeeName      Thứ tự sắp xếp theo tên
     * @param sortCertificationName Thứ tự sắp xếp theo chứng chỉ
     * @param sortEndDate           Thứ tự sắp xếp theo ngày hết hạn
     * @param limit                 Số lượng bản ghi trên một trang
     * @param offset                Vị trí bắt đầu lấy bản ghi
     * @return Đối tượng bao bọc kết quả danh sách và thông tin phân trang
     */
    @GetMapping("/employees")
    public ResponseEntity<EmployeeListResponse> getEmployeeList(
            @RequestParam(value = "employeeName", required = false, defaultValue = "") String employeeName,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "sortEmployeeName", required = false, defaultValue = AppConstants.SORT_ASC) String sortEmployeeName,
            @RequestParam(value = "sortCertificationName", required = false, defaultValue = AppConstants.SORT_DESC) String sortCertificationName,
            @RequestParam(value = "sortEndDate", required = false, defaultValue = AppConstants.SORT_ASC) String sortEndDate,
            @RequestParam(value = "limit", required = false, defaultValue = AppConstants.DEFAULT_LIMIT_STR) Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {

        try {
            // Bước 1: Kiểm tra tính hợp lệ của các tham số sắp xếp (Sort)
            if (!EmployeeValidation.isValidSort(sortEmployeeName) ||
                    !EmployeeValidation.isValidSort(sortCertificationName) ||
                    !EmployeeValidation.isValidSort(sortEndDate)) {
                return ResponseEntity.ok(EmployeeListResponse.error(AppConstants.ER021,
                        messageSource.getMessage(AppConstants.ER021, null, LocaleContextHolder.getLocale())));
            }

            // Bước 2: Truy vấn tổng số lượng nhân viên thỏa mãn điều kiện lọc
            Long totalRecords = employeeService.countEmployeesWithFilter(
                    employeeName.isEmpty() ? null : employeeName,
                    departmentId);

            List<EmployeeDTO> employees = new ArrayList<>();

            // Chỉ thực hiện lấy danh sách nếu có bản ghi tồn tại
            if (totalRecords > 0) {
                // Kiểm tra xem vị trí bắt đầu (Offset) có vượt quá tổng số bản ghi không
                if (offset >= totalRecords) {
                    return ResponseEntity.ok(EmployeeListResponse.error(AppConstants.ER022,
                            messageSource.getMessage(AppConstants.ER022, null, LocaleContextHolder.getLocale())));
                }

                // Bước 3: Lấy danh sách nhân viên chi tiết từ Cơ sở dữ liệu
                employees = employeeService.getListEmployee(
                        employeeName.isEmpty() ? null : employeeName,
                        departmentId,
                        sortEmployeeName.toLowerCase(),
                        sortCertificationName.toLowerCase(),
                        sortEndDate.toLowerCase(),
                        limit,
                        offset);
            }

            // Bước 4: Đóng gói dữ liệu và trả về kết quả thành công
            EmployeeListResponse response = new EmployeeListResponse();
            response.setCode(AppConstants.SUCCESS_CODE);
            response.setTotalRecords(totalRecords);
            response.setEmployees(employees);
            response.setParams(new ArrayList<>()); // Đảm bảo params luôn là mảng rỗng [] theo đặc tả

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Ghi log lỗi chi tiết phục vụ việc truy vết hệ thống
            log.error("Lỗi hệ thống khi xử lý lấy danh sách nhân viên: ", e);

            // Trả về thông báo lỗi hệ thống tổng quát cho người dùng kèm mã HTTP 500
            EmployeeListResponse errorResponse = EmployeeListResponse.error(AppConstants.SYSTEM_ERROR_CODE,
                    messageSource.getMessage(AppConstants.ER023, null, LocaleContextHolder.getLocale()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * API truy vấn thông tin chi tiết một nhân viên theo ID.
     * 
     * @param id Khóa chính của nhân viên
     * @return Dữ liệu chi tiết nhân viên (DTO)
     */
    @GetMapping("/employees/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        try {
            EmployeeDTO employee = employeeService.getEmployeeById(id);
            if (employee == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(employee);
        } catch (Exception e) {
            log.error("Lỗi khi truy xuất chi tiết nhân viên có id " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
