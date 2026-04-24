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
    }
    if (!data.certificationEndDate) {
      ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: err.ER001(L.CERT_END_DATE) });
    }
    if (!data.certificationScore) {
      ctx.addIssue({ code: "custom", path: ['certificationScore'], message: err.ER001(L.CERT_SCORE) });
    }

    // Check ngày hết hạn phải sau ngày cấp chứng chỉ (ER012)
    if (data.certificationStartDate && data.certificationEndDate) {
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
