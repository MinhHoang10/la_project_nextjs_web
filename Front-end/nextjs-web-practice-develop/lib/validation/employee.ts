import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/messages';
import { LABELS } from '../constants/labels';

// Lấy từ điển làm mặc định 
const err = ERROR_MESSAGES;
const L = LABELS.EMPLOYEE;

// Mẫu tra cứu
const kanaRegex = /^[ァ-ンヴー]+$/; // Chỉ ký tự Katakana (Nhật)
const accountRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // Không có số ở đầu, chỉ chấp nhận a-z, A-Z, 0-9, _
const halfSizeNumberRegex = /^[0-9]+$/; // Chữ số Halfsize

export const employeeSchema = z.object({
  employeeLoginId: z.string()
    .min(1, err.ER001(L.LOGIN_ID))
    .max(50, err.ER006(L.LOGIN_ID, 50))
    .regex(accountRegex, err.ER019())
    .describe(L.LOGIN_ID),

  employeeName: z.string()
    .min(1, err.ER001(L.NAME))
    .max(125, err.ER006(L.NAME, 125))
    .describe(L.NAME),

  employeeNameKana: z.string()
    .min(1, err.ER001(L.NAME_KANA))
    .max(125, err.ER006(L.NAME_KANA, 125))
    .regex(kanaRegex, err.ER009(L.NAME_KANA))
    .describe(L.NAME_KANA),

  employeeBirthDate: z.string()
    .min(1, err.ER001(L.BIRTH_DATE))
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, err.ER005(L.BIRTH_DATE, 'yyyy/MM/dd'))
    .refine((val) => {
      if (!/^\d{4}\/\d{2}\/\d{2}$/.test(val)) return true;
      const parts = val.split('/');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const date = new Date(y, m - 1, d);
      return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    }, err.ER011(L.BIRTH_DATE))
    .describe(L.BIRTH_DATE),

  employeeEmail: z.string()
    .min(1, err.ER001(L.EMAIL))
    .max(125, err.ER006(L.EMAIL, 125))
    .email(err.ER005(L.EMAIL, 'メール'))
    .describe(L.EMAIL),

  employeeTelephone: z.string()
    .min(1, err.ER001(L.TELEPHONE))
    .max(50, err.ER006(L.TELEPHONE, 50))
    .regex(halfSizeNumberRegex, err.ER018(L.TELEPHONE))
    .describe(L.TELEPHONE),

  departmentId: z.number().min(1, err.ER002(L.DEPARTMENT))
    .describe(L.DEPARTMENT),

  employeeLoginPassword: z.string()
    .min(8, err.ER007(L.PASSWORD, 8, 50))
    .max(50, err.ER007(L.PASSWORD, 8, 50))
    .optional()
    .or(z.literal(''))
    .describe(L.PASSWORD),

  employeeLoginPasswordConfirm: z.string()
    .optional()
    .or(z.literal(''))
    .describe(L.PASSWORD_CONFIRM),

  certificationId: z.coerce.number().optional().nullable().describe(L.CERTIFICATION),
  certificationStartDate: z.string().optional().or(z.literal('')).describe(L.CERT_START_DATE),
  certificationEndDate: z.string().optional().or(z.literal('')).describe(L.CERT_END_DATE),
  certificationScore: z.string().optional().or(z.literal('')).describe(L.CERT_SCORE),

}).superRefine((data, ctx) => {
  // Validate Password Confirm 
  if (data.employeeLoginPassword && data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
    ctx.addIssue({
      code: "custom",
      path: ['employeeLoginPasswordConfirm'],
      message: err.ER017()
    });
  }

  // Nếu người dùng chọn 1 Chứng chỉ bất kỳ, phải nhập validate Ngày tháng và Điểm
  if (data.certificationId && data.certificationId > 0) {
    if (!data.certificationStartDate) {
      ctx.addIssue({ code: "custom", path: ['certificationStartDate'], message: err.ER001(L.CERT_START_DATE) });
    } else {
      if (!/^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationStartDate)) {
        ctx.addIssue({ code: "custom", path: ['certificationStartDate'], message: err.ER005(L.CERT_START_DATE, 'yyyy/MM/dd') });
      } else {
        const parts = data.certificationStartDate.split('/');
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (date.getFullYear() !== parseInt(parts[0], 10) || date.getMonth() !== parseInt(parts[1], 10) - 1 || date.getDate() !== parseInt(parts[2], 10)) {
          ctx.addIssue({ code: "custom", path: ['certificationStartDate'], message: err.ER011(L.CERT_START_DATE) });
        }
      }
    }

    if (!data.certificationEndDate) {
      ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: err.ER001(L.CERT_END_DATE) });
    } else {
      if (!/^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationEndDate)) {
        ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: err.ER005(L.CERT_END_DATE, 'yyyy/MM/dd') });
      } else {
        const parts = data.certificationEndDate.split('/');
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (date.getFullYear() !== parseInt(parts[0], 10) || date.getMonth() !== parseInt(parts[1], 10) - 1 || date.getDate() !== parseInt(parts[2], 10)) {
          ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: err.ER011(L.CERT_END_DATE) });
        }
      }
    }

    if (!data.certificationScore) {
      ctx.addIssue({ code: "custom", path: ['certificationScore'], message: err.ER001(L.CERT_SCORE) });
    }

    // Check ngày hết hạn phải sau ngày cấp chứng chỉ (ER012)
    if (data.certificationStartDate && data.certificationEndDate && /^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationStartDate) && /^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationEndDate)) {
      const start = new Date(data.certificationStartDate);
      const end = new Date(data.certificationEndDate);
      if (end < start) {
        ctx.addIssue({
          code: "custom",
          path: ['certificationEndDate'],
          message: err.ER012(L.CERT_END_DATE, L.CERT_START_DATE)
        });
      }
    }
  }
});

// Mapping bổ sung cho các trường không có trong schema chính
const ADDITIONAL_LABELS: Record<string, string> = {
  employeeId: '会員ID',
  certificationName: L.CERT_NAME,
};

/**
 * Trích xuất label từ Zod schema bằng .description
 */
export const getEmployeeLabel = (field: string): string => {
  const schemaField = employeeSchema.shape[field as keyof typeof employeeSchema.shape];
  if (schemaField && schemaField.description) {
    return schemaField.description;
  }
  return ADDITIONAL_LABELS[field] || field;
};

export type EmployeeForm = z.infer<typeof employeeSchema>;

import { EmployeeFormDTO } from '@/types/employee';

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
  // Lấy nhãn hiển thị chuẩn thông qua getEmployeeLabel
  const label = getEmployeeLabel(fieldKey) || String(fieldKey);
  const max = FIELD_MAX_LENGTHS[fieldKey] || 0;

  switch (errorCode) {
    case 'ER001': return ERROR_MESSAGES.ER001(label);
    case 'ER002': return ERROR_MESSAGES.ER002(label);
    case 'ER003': return ERROR_MESSAGES.ER003(label);
    case 'ER005': return ERROR_MESSAGES.ER005(label, "yyyy/MM/dd");
    case 'ER006': return ERROR_MESSAGES.ER006(label, max);
    case 'ER007': return ERROR_MESSAGES.ER007(label, 0, max);
    case 'ER008': return ERROR_MESSAGES.ER008(label);
    case 'ER009': return ERROR_MESSAGES.ER009(label);
    case 'ER011': return ERROR_MESSAGES.ER011(label);
    case 'ER012': return ERROR_MESSAGES.ER012(label, getEmployeeLabel('certificationStartDate') || '資格交付日');
    case 'ER017': return ERROR_MESSAGES.ER017();
    case 'ER018': return ERROR_MESSAGES.ER018(label);
    case 'ER019': return ERROR_MESSAGES.ER019();
    default:
      // Nếu không map được (như lỗi không có tham số ER015), thử dùng trực tiếp nếu có
      const msgFunc = ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] as any;
      if (typeof msgFunc === 'function') {
        try { return msgFunc(label); } catch (e) { return errorCode; }
      }
      return errorCode;
  }
}
