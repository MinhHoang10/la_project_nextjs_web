import { INFO_MESSAGES } from './messages';

export const QUERY_PARAMS = {
  MODE: 'mode',
  ID: 'id',
  ERROR: 'error',
} as const;

export const APP_MODES = {
  ADD: 'add',
  EDIT: 'edit',
  BACK: 'back',
  DELETE: 'delete',
} as const;

/**
 * Thông báo hoàn tất xử lý hiển thị trên màn hình ADM006.
 * Tên biến theo đúng mã thông báo trong tài liệu thiết kế.
 */
export const COMPLETION_MESSAGES = {
  DEFAULT: '処理が完了しました。',
  MSG001: INFO_MESSAGES.MSG001,
  MSG002: INFO_MESSAGES.MSG002,
  MSG003: INFO_MESSAGES.MSG003,
} as const;

export const EMPLOYEE_COMPLETE_MESSAGE_MAP: Record<string, string> = {
  [APP_MODES.ADD]: COMPLETION_MESSAGES.MSG001,
  [APP_MODES.EDIT]: COMPLETION_MESSAGES.MSG002,
  [APP_MODES.DELETE]: COMPLETION_MESSAGES.MSG003,
};

export const API_STATUS_CODES = {
  SUCCESS: '200',
  SYSTEM_ERROR: '500',
} as const;
