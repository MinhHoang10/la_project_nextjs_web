/**
 * Copyright(C) 2026 Luvina Software Company
 * ValidationUtils.java, 5/04/2026 NguyenHuyHoang
 */
package com.luvina.la.util;

import com.luvina.la.constant.AppConstants;
import com.luvina.la.payload.MessageResponse;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.List;

/**
 * Lớp tiện ích cung cấp các quy tắc kiểm tra dữ liệu dùng chung cho toàn bộ hệ
 * thống.
 * Giúp giảm thiểu lặp code và đảm bảo tính nhất quán của thông báo lỗi.
 * 
 * @author Nguyen Huy Hoang
 */
public class ValidationUtils {

    private ValidationUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Kiểm tra chuỗi rỗng hoặc null.
     * 
     * @param value Chuỗi cần kiểm tra
     * @return true nếu chuỗi rỗng hoặc null, false ngược lại
     */
    public static boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    /**
     * Kiểm tra định dạng ngày tháng yyyy/MM/dd.
     * 
     * @param dateStr Chuỗi cần kiểm tra
     * @return true nếu chuỗi có định dạng yyyy/MM/dd, false ngược lại
     */
    public static boolean isValidFormat(String dateStr) {
        return dateStr != null && dateStr.matches("^\\d{4}/\\d{2}/\\d{2}$");
    }

    /**
     * Parse chuỗi sang ngày tháng theo định dạng AppConstants.DATE_FORMAT.
     * 
     * @param dateStr Chuỗi cần parse
     * @return Đối tượng LocalDate chứa thông tin ngày tháng, null nếu parse lỗi
     */
    public static LocalDate parseDate(String dateStr) {
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT));
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Kiểm tra tính bắt buộc và độ dài tối đa của một trường dữ liệu.
     * 
     * @param value  Giá trị chuỗi
     * @param label  Tên trường hiển thị lỗi
     * @param max    Độ dài tối đa
     * @param errors Danh sách chứa thông báo lỗi
     */
    public static void validateRequiredAndLength(String value, String label, int max, List<MessageResponse> errors) {
        if (isEmpty(value)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, label));
        } else if (value.length() > max) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER006, label));
        }
    }

    /**
     * Kiểm tra tính hợp lệ của ngày tháng (Bắt buộc, Định dạng và Ngày có thực).
     * 
     * @param dateStr Chuỗi ngày tháng
     * @param label   Tên trường hiển thị lỗi
     * @param errors  Danh sách chứa thông báo lỗi
     */
    public static void validateDate(String dateStr, String label, List<MessageResponse> errors) {
        if (isEmpty(dateStr)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER001, label));
            return;
        }

        // 1. Kiểm tra định dạng yyyy/MM/dd
        if (!isValidFormat(dateStr)) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER005, label, AppConstants.DATE_FORMAT));
            return;
        }

        // 2. Kiểm tra ngày có thực không
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu/MM/dd")
                    .withResolverStyle(ResolverStyle.STRICT);
            LocalDate.parse(dateStr, dtf);
        } catch (DateTimeParseException e) {
            errors.add(MessageResponse.buildMessage(AppConstants.ER011, label));
        }
    }

    /**
     * Kiểm tra tính hợp lệ của hướng sắp xếp.
     * 
     * @param sort Hướng sắp xếp (ASC/DESC)
     * @return true nếu hợp lệ, false ngược lại
     */
    public static boolean isValidSort(String sort) {
        return AppConstants.SORT_ASC.equalsIgnoreCase(sort) || AppConstants.SORT_DESC.equalsIgnoreCase(sort);
    }
}
