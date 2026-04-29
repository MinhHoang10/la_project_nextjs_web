/**
 * Từ điển các thông báo lỗi.
 * Dùng cho Validate Zod trên Frontend và hiển thị Message từ Backend.
 */

export const ERROR_MESSAGES = {
  ER001: (field: string) => `「${field}」を入力してください`,
  ER002: (field: string) => `「${field}」を選択してください`,
  ER003: (field: string) => `「${field}」は既に存在しています。`,
  ER004: (field: string) => `「${field}」は存在していません。`,
  ER005: (field: string, format: string) => `「${field}」を${format}形式で入力してください`,
  ER006: (field: string, max: number) => `${max}桁以内の「${field}」を入力してください`,
  ER007: (field: string, min: number, max: number) => `「${field}」を${min} =< 桁数、<= ${max}桁で入力してください`,
  ER008: (field: string) => `「${field}」に半角英数を入力してください`,
  ER009: (field: string) => `「${field}」をカタカナで入力してください`,
  ER010: (field: string) => `「${field}」をひらがなで入力してください`,
  ER011: (field: string) => `「${field}」は無効になっています。`,
  ER012: (field: string, targetDate: string) => `「${field}」は「${targetDate}」より未来の日で入力してください。`,
  ER013: () => '該当するユーザは存在していません。',
  ER014: () => '該当するユーザは存在していません。',
  ER015: () => 'システムエラーが発生しました。',
  ER016: () => '「アカウント名」または「パスワード」は不正です。',
  ER017: () => '「パスワード（確認）」が不正です。',
  ER018: (field: string) => `「${field}」は半角で入力してください。`,
  ER019: () => '「アカウント名」は(a-z, A-Z, 0-9 と _)の桁のみです。最初の桁は数字ではない。',
  ER020: () => '管理者ユーザを削除することはできません。',
  ER021: () => 'ソートは (ASC, DESC) でなければなりません。',
  ER022: () => 'ページが見つかりません。',
  ER023: () => 'システムエラーが発生しました。',
};
