/**
 * Định nghĩa toàn bộ nhãn hiển thị (Labels) tiếng Nhật dùng chung cho hệ thống.
 */
export const LABELS = {
  EMPLOYEE: {
    LOGIN_ID: 'アカウント名',
    NAME: '氏名',
    NAME_KANA: 'カタカナ氏名',
    BIRTH_DATE: '生年月日',
    EMAIL: 'メールアドレス',
    TELEPHONE: '電話番号',
    PASSWORD: 'パスワード',
    PASSWORD_CONFIRM: 'パスワード（確認）',
    DEPARTMENT: 'グループ',
    CERTIFICATION: '資格',
    CERT_START_DATE: '資格交付日',
    CERT_END_DATE: '失効日',
    CERT_SCORE: '点数',
    CERT_NAME: '日本語能力',
  },
  COMMON: {
    ITEM: '項目',
  }
} as const;

/**
 * Hàm chuyển đổi nhãn tiếng Nhật (trả về từ Backend) sang tên trường của form.
 */
export const mapLabelToField = (label: string): keyof import('@/types/employee').FieldErrors | null => {
  switch (label) {
    case 'アカウント名': return 'employeeLoginId';
    case 'グループ': return 'departmentId';
    case '氏名': return 'employeeName';
    case 'カタカナ氏名': return 'employeeNameKana';
    case '生年月日': return 'employeeBirthDate';
    case 'メールアドレス': return 'employeeEmail';
    case '電話番号': return 'employeeTelephone';
    case 'パスワード': return 'employeeLoginPassword';
    case 'パスワード（確認）': return 'employeeLoginPasswordConfirm';
    case '資格': return 'certificationId';
    case '資格交付日': return 'certificationStartDate';
    case '失効日': return 'certificationEndDate';
    case '点数': return 'certificationScore';
    default: return null;
  }
};
