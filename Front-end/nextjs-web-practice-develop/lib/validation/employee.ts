/**
 * Copyright(C) 2026 Luvina Software Company
 * employee.ts, 5/4/2026 NguyenHuyHoang
 */
import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/messages';
import { LABELS } from '../constants/labels';
import { EmployeeFormDTO } from '@/types/employee';

// Alias rõ nghĩa cho từ điển lỗi và nhãn nhân viên
const errorMessages = ERROR_MESSAGES;
const labelEmployee = LABELS.EMPLOYEE;

// Mẫu tra cứu
const kanaRegex = /^[ｦ-ﾟ]+$/; // Chỉ ký tự Katakana half-size (Nhật)
const accountRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // Không có số ở đầu, chỉ chấp nhận a-z, A-Z, 0-9, _
const halfSizeNumberRegex = /^[\x00-\x7F]+$/; // Ký tự Halfsize

export const employeeSchema = z.object({
  employeeLoginId: z.string()
    .min(1, errorMessages.ER001(labelEmployee.LOGIN_ID))
    .max(50, errorMessages.ER006(labelEmployee.LOGIN_ID, 50))
    .regex(accountRegex, errorMessages.ER019())
    .describe(labelEmployee.LOGIN_ID),

  employeeName: z.string()
    .min(1, errorMessages.ER001(labelEmployee.NAME))
    .max(125, errorMessages.ER006(labelEmployee.NAME, 125))
    .describe(labelEmployee.NAME),

  employeeNameKana: z.string()
    .min(1, errorMessages.ER001(labelEmployee.NAME_KANA))
    .max(125, errorMessages.ER006(labelEmployee.NAME_KANA, 125))
    .regex(kanaRegex, errorMessages.ER009(labelEmployee.NAME_KANA))
    .describe(labelEmployee.NAME_KANA),

  employeeBirthDate: z.string()
    .min(1, errorMessages.ER001(labelEmployee.BIRTH_DATE))
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, errorMessages.ER005(labelEmployee.BIRTH_DATE, 'yyyy/MM/dd'))
    .refine((val) => {
      if (!/^\d{4}\/\d{2}\/\d{2}$/.test(val)) return true;
      const parts = val.split('/');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const date = new Date(y, m - 1, d);
      return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    }, errorMessages.ER011(labelEmployee.BIRTH_DATE))
    .describe(labelEmployee.BIRTH_DATE),

  employeeEmail: z.string()
    .min(1, errorMessages.ER001(labelEmployee.EMAIL))
    .max(125, errorMessages.ER006(labelEmployee.EMAIL, 125))
    .email(errorMessages.ER005(labelEmployee.EMAIL, 'メール'))
    .describe(labelEmployee.EMAIL),

  employeeTelephone: z.string()
    .min(1, errorMessages.ER001(labelEmployee.TELEPHONE))
    .max(50, errorMessages.ER006(labelEmployee.TELEPHONE, 50))
    .regex(halfSizeNumberRegex, errorMessages.ER018(labelEmployee.TELEPHONE))
    .describe(labelEmployee.TELEPHONE),

  departmentId: z.coerce.number({
    // Zod v4: dùng 'error' thay vì 'invalid_type_error' (Zod v3)
    // Khi chưa chọn phòng ban (undefined → NaN), hiển thị đúng ER001
    error: errorMessages.ER001(labelEmployee.DEPARTMENT)
  }).min(1, errorMessages.ER001(labelEmployee.DEPARTMENT))
    .describe(labelEmployee.DEPARTMENT),

  employeeLoginPassword: z.string()
    .min(8, errorMessages.ER007(labelEmployee.PASSWORD, 8, 50))
    .max(50, errorMessages.ER007(labelEmployee.PASSWORD, 8, 50))
    .optional()
    .or(z.literal(''))
    .describe(labelEmployee.PASSWORD),

  employeeLoginPasswordConfirm: z.string()
    .optional()
    .or(z.literal(''))
    .describe(labelEmployee.PASSWORD_CONFIRM),

  certificationId: z.coerce.number().optional().nullable().describe(labelEmployee.CERTIFICATION),
  certificationStartDate: z.string().optional().or(z.literal('')).describe(labelEmployee.CERT_START_DATE),
  certificationEndDate: z.string().optional().or(z.literal('')).describe(labelEmployee.CERT_END_DATE),
  certificationScore: z.string().optional().or(z.literal('')).describe(labelEmployee.CERT_SCORE),

}).superRefine((data, ctx) => {
  // Validate Password Confirm
  if (data.employeeLoginPassword && data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
    ctx.addIssue({
      code: "custom",
      path: ['employeeLoginPasswordConfirm'],
      message: errorMessages.ER017()
    });
  }

  // Nếu người dùng chọn 1 Chứng chỉ bất kỳ, phải nhập validate Ngày tháng và Điểm
  if (data.certificationId && data.certificationId > 0) {
    if (!data.certificationStartDate) {
      ctx.addIssue({ code: "custom", path: ['certificationStartDate'], message: errorMessages.ER001(labelEmployee.CERT_START_DATE) });
    } else {
      if (!/^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationStartDate)) {
        ctx.addIssue({ code: "custom", path: ['certificationStartDate'], message: errorMessages.ER005(labelEmployee.CERT_START_DATE, 'yyyy/MM/dd') });
      } else {
        const parts = data.certificationStartDate.split('/');
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (date.getFullYear() !== parseInt(parts[0], 10) || date.getMonth() !== parseInt(parts[1], 10) - 1 || date.getDate() !== parseInt(parts[2], 10)) {
          ctx.addIssue({ code: "custom", path: ['certificationStartDate'], message: errorMessages.ER011(labelEmployee.CERT_START_DATE) });
        }
      }
    }

    if (!data.certificationEndDate) {
      ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: errorMessages.ER001(labelEmployee.CERT_END_DATE) });
    } else {
      if (!/^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationEndDate)) {
        ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: errorMessages.ER005(labelEmployee.CERT_END_DATE, 'yyyy/MM/dd') });
      } else {
        const parts = data.certificationEndDate.split('/');
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (date.getFullYear() !== parseInt(parts[0], 10) || date.getMonth() !== parseInt(parts[1], 10) - 1 || date.getDate() !== parseInt(parts[2], 10)) {
          ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: errorMessages.ER011(labelEmployee.CERT_END_DATE) });
        }
      }
    }

    if (!data.certificationScore) {
      ctx.addIssue({ code: "custom", path: ['certificationScore'], message: errorMessages.ER001(labelEmployee.CERT_SCORE) });
    } else if (!/^[0-9]+$/.test(data.certificationScore)) {
      ctx.addIssue({ code: "custom", path: ['certificationScore'], message: errorMessages.ER018(labelEmployee.CERT_SCORE) });
    }

    // Kiểm tra ngày hết hạn phải sau ngày cấp chứng chỉ (ER012)
    if (
      data.certificationStartDate &&
      data.certificationEndDate &&
      /^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationStartDate) &&
      /^\d{4}\/\d{2}\/\d{2}$/.test(data.certificationEndDate)
    ) {
      const start = new Date(data.certificationStartDate);
      const end = new Date(data.certificationEndDate);
      if (end < start) {
        ctx.addIssue({
          code: "custom",
          path: ['certificationEndDate'],
          message: errorMessages.ER012(labelEmployee.CERT_END_DATE, labelEmployee.CERT_START_DATE)
        });
      }
    }
  }
});

// Mapping bổ sung cho các trường không có trong schema chính
const ADDITIONAL_LABELS: Record<string, string> = {
  employeeId: '会員ID',
  certificationName: labelEmployee.CERT_NAME,
};

/**
 * Trích xuất nhãn hiển thị của một trường từ Zod schema thông qua thuộc tính .description.
 * Dự phòng bằng ADDITIONAL_LABELS nếu trường không có trong schema chính.
 *
 * @param field - Tên trường cần lấy nhãn
 * @return Nhãn hiển thị tiếng Nhật tương ứng, hoặc chính tên trường nếu không tìm thấy
 */
export const getEmployeeLabel = (field: string): string => {
  const schemaField = employeeSchema.shape[field as keyof typeof employeeSchema.shape];
  if (schemaField && schemaField.description) {
    return schemaField.description;
  }
  return ADDITIONAL_LABELS[field] || field;
};

export type EmployeeForm = z.infer<typeof employeeSchema>;

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
 * Hàm trợ giúp để chuyển đổi mã lỗi từ backend (VD: ER003, ER013...) thành các thông báo lỗi thân thiện với người dùng.
 *
 * @param errorCode - Mã lỗi backend (String) - Ví dụ: "ER001", "ER003", "ER012"
 * @param fieldKey  - Khóa của trường form bị lỗi (keyof EmployeeFormDTO) - Ví dụ: "employeeLoginId", "certificationEndDate"
 * @returns Chuỗi thông báo lỗi tiếng Nhật đã được định dạng, sẵn sàng để hiển thị trên UI.
 *          Sử dụng getEmployeeLabel để đảm bảo nhãn hiển thị thống nhất.
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
