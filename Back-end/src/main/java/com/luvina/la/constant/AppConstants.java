/**
 * Copyright(C) 2026 Luvina Software Company
 * AppConstants.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.constant;

/**
 * Lớp chứa các hằng số dùng chung cho toàn bộ ứng dụng.
 * Bao gồm các mã lỗi, nhãn trường, định dạng ngày tháng và các giá trị cấu
 * hình.
 */
public class AppConstants {

    // ===== Mã lỗi nghiệp vụ (Business Error Codes) =====
    public static final String SUCCESS_CODE = "200";
    public static final String BAD_REQUEST_CODE = "400";
    public static final String SYSTEM_ERROR_CODE = "500";

    public static final String ER001 = "ER001"; // Thiếu trường bắt buộc
    public static final String ER002 = "ER002"; // Chưa chọn phòng ban/chứng chỉ
    public static final String ER003 = "ER003"; // Trùng lặp dữ liệu (Login ID)
    public static final String ER004 = "ER004"; // Không tìm thấy dữ liệu
    public static final String ER005 = "ER005"; // Sai định dạng (Email, Date)
    public static final String ER006 = "ER006"; // Vượt quá độ dài tối đa
    public static final String ER007 = "ER007"; // Vượt quá độ dài (Min/Max)
    public static final String ER008 = "ER008"; // Không phải ký tự 1 byte (Dùng cho Số điện thoại)
    public static final String ER009 = "ER009"; // Không phải Katakana
    public static final String ER011 = "ER011"; // Ngày tháng không tồn tại (Ví dụ: ngày 32)
    public static final String ER012 = "ER012"; // Ngày kết hạn phải sau ngày cấp
    public static final String ER015 = "ER015"; // Lỗi hệ thống (System Error)
    public static final String ER017 = "ER017"; // Mật khẩu xác nhận không khớp
    public static final String ER018 = "ER018"; // Số nguyên dương half-size
    public static final String ER019 = "ER019"; // Format LoginID (a-z, 0-9, _)
    public static final String ER021 = "ER021"; // Sort invalid
    public static final String ER022 = "ER022"; // Offset invalid
    public static final String MSG001 = "MSG001"; // Thêm mới/Cập nhật thành công

    // ===== Mã lỗi nghiệp vụ cho chức năng Đăng nhập (Login) =====
    public static final String LOGIN_FAILED_CODE = "401"; // Sai User/Pass
    public static final String LOGIN_UNKNOWN_CODE = "401.1"; // Lỗi không xác định khi Login

    // ===== Nhãn các hạng mục (Field Labels) =====
    public static final String LABEL_LOGIN_ID = "アカウント名";
    public static final String LABEL_NAME = "氏名";
    public static final String LABEL_NAME_KANA = "カタカナ氏名";
    public static final String LABEL_BIRTH_DATE = "生年月日";
    public static final String LABEL_EMAIL = "メールアドレス";
    public static final String LABEL_TELEPHONE = "電話番号";
    public static final String LABEL_PASSWORD = "パスワード";
    public static final String LABEL_PASSWORD_CONFIRM = "パスワード（確認）";
    public static final String LABEL_DEPARTMENT = "グループ";
    public static final String LABEL_CERTIFICATION = "資格";
    public static final String LABEL_CERT_START_DATE = "資格交付日";
    public static final String LABEL_CERT_END_DATE = "失効日";
    public static final String LABEL_CERT_SCORE = "点数";

    // ===== Cấu hình giới hạn độ dài (Length Constraints) =====
    public static final int MAX_LENGTH_LOGIN_ID = 50;
    public static final int MAX_LENGTH_NAME = 125;
    public static final int MAX_LENGTH_NAME_KANA = 125;
    public static final int MAX_LENGTH_EMAIL = 125;
    public static final int MAX_LENGTH_TELEPHONE = 50;
    public static final int MIN_LENGTH_PASSWORD = 8;
    public static final int MAX_LENGTH_PASSWORD = 50;

    // ===== Định dạng (Formats) =====
    public static final String DATE_FORMAT = "yyyy/MM/dd";
    public static final String SORT_ASC = "ASC";
    public static final String SORT_DESC = "DESC";

    // ===== Giá trị mặc định (Default values) =====
    public static final String DEFAULT_LIMIT_STR = "20";
}
