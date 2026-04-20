package com.luvina.la.controller;

import com.luvina.la.constant.AppConstants;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Lớp xử lý ngoại lệ toàn cục (Global Exception Handler).
 * Đảm nhận xử lý MethodArgumentNotValidException khi dữ liệu đầu vào không hợp lệ.
 *
 * @author Nguyen Huy Hoang
 */
@RestControllerAdvice
public class ValidationExceptionHandler {

    private final MessageSource messageSource;

    public ValidationExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Xử lý ngoại lệ validation và trả về thông báo lỗi dưới dạng JSON.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", AppConstants.BAD_REQUEST_CODE);
        response.put("error", "Bad Request");

        Map<String, String> errorDetails = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorCode = error.getDefaultMessage(); // Sẽ nhận các giá trị "ER001" setup từ DTO.

            try {
                // Tái tạo Arguments (tham số) để nhét tên cột tiếng Anh vào thay chỗ {0}
                // Các Object của index 1, 2... tiếp theo sẽ là Max Length, Pattern do Spring cung cấp.
                Object[] originArgs = error.getArguments();
                Object[] customArgs = new Object[originArgs != null ? originArgs.length : 1];
                customArgs[0] = fieldName;
                if (originArgs != null && originArgs.length > 1) {
                    System.arraycopy(originArgs, 1, customArgs, 1, originArgs.length - 1);
                }

                String errorMessage = messageSource.getMessage(errorCode, customArgs, LocaleContextHolder.getLocale());
                errorDetails.put(fieldName, errorMessage);
            } catch (Exception e) {
                // Nếu errorCode không nằm trong file cấu hình (Không phải kiểu ERxxx).
                errorDetails.put(fieldName, errorCode);
            }
        });

        response.put("message", errorDetails);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
