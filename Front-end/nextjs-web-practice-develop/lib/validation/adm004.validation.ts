/**
 * Copyright(C) 2026 Luvina Software Company
 * adm004.validation.ts, 4/21/2026 NguyenHuyHoang
 */

import { EmployeeFormDTO } from '@/types/employee';

// ----- Định nghĩa kiểu dữ liệu -----

/** Đối tượng lỗi cho mỗi trường trong form */
export interface FieldErrors {
  [key: string]: string | undefined; // Thêm index signature để cho phép truy cập bằng biến key
  employeeLoginId?: string;
  departmentId?: string;
  employeeName?: string;
  employeeNameKana?: string;
  employeeBirthDate?: string;
  employeeEmail?: string;
  employeeTelephone?: string;
  employeeLoginPassword?: string;
  employeeLoginPasswordConfirm?: string;
  certificationId?: string;
  certificationStartDate?: string;
  certificationEndDate?: string;
  certificationScore?: string;
}


// ----- Hàm validation chính -----


// ----- Xây dựng thông báo lỗi -----

/**
 * Ánh xạ mã lỗi sang thông báo hiển thị (tiếng Nhật — phù hợp với spec dự án).
 * Sử dụng {{field}} làm placeholder cho nhãn trường.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  ER001: '{{field}}を入力してください',
  ER002: '{{field}}を選択してください',
  ER003: '{{field}}は既に存在しています。',
  ER005: '{{field}}はxx形式で入力してください',
  ER006: '{{field}}は{{max}}文字以内で入力してください',
  ER007: '{{field}}は{{max}}文字以内で入力してください',
  ER008: '{{field}}は半角英数字を入力してください',
  ER009: '{{field}}をカタカナで入力してください',
  ER012: '失効日は資格交付日より未来の日を入力してください',
  ER017: 'パスワード（確認）が不正です。',
  ER018: '{{field}}は半角で入力してください',
  ER019: 'アカウント名は(a-z, A-Z, 0-9と_)のみです。最初の桁は数字ではない。',
};

/** Mapping các nhãn hiển thị (trùng với tên trên màn hình) */
export const FIELD_LABELS: Partial<Record<keyof EmployeeFormDTO, string>> = {
  employeeLoginId: 'アカウント名',
  departmentId: 'グループ',
  employeeName: '氏名',
  employeeNameKana: 'カタカナ氏名',
  employeeBirthDate: '生年月日',
  employeeEmail: 'メールアドレス',
  employeeTelephone: '電話番号',
  employeeLoginPassword: 'パスワード',
  employeeLoginPasswordConfirm: 'パスワード（確認）',
  certificationId: '資格',
  certificationStartDate: '資格交付日',
  certificationEndDate: '失効日',
  certificationScore: '点数',
};

/** Giới hạn ký tự tối đa cho thông báo lỗi ER006/ER007 */
const FIELD_MAX_LENGTHS: Partial<Record<keyof EmployeeFormDTO, number>> = {
  employeeLoginId: 50,
  employeeName: 125,
  employeeNameKana: 125,
  employeeEmail: 125,
  employeeTelephone: 50,
  employeeLoginPassword: 50,
  employeeLoginPasswordConfirm: 50,
};

/**
 * Trả về thông báo lỗi dễ đọc từ mã lỗi và khóa trường.
 */
export function resolveErrorMessage(
  errorCode: string,
  fieldKey: keyof EmployeeFormDTO
): string {
  const template = ERROR_MESSAGES[errorCode] ?? errorCode;
  const label = FIELD_LABELS[fieldKey] ?? String(fieldKey);
  const max = FIELD_MAX_LENGTHS[fieldKey];

  return template
    .replace('{{field}}', label)
    .replace('{{max}}', max ? String(max) : '');
}

/** Kiểm tra xem đối tượng FieldErrors có lỗi hay không */
export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some((v) => v !== undefined);
}

