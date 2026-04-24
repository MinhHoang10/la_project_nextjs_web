/**
 * Các hằng số dùng chung cho toàn bộ ứng dụng (Query params, Modes, v.v.)
 */

export const QUERY_PARAMS = {
  MODE: 'mode',
  ID: 'id',
  ERROR: 'error',
} as const;

export const APP_MODES = {
  ADD: 'add',
  EDIT: 'edit',
  BACK: 'back',
} as const;
