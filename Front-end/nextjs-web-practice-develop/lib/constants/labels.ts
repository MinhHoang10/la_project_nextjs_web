/**
 * Định nghĩa toàn bộ nhãn hiển thị (Labels) tiếng Nhật dùng chung cho hệ thống.
 * Đảm bảo đồng bộ với AppConstants.java ở Backend.
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
