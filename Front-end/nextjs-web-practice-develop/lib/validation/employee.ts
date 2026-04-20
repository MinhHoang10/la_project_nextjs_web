import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/messages';

// Lấy từ điển Tiếng Nhật làm mặc định 
const err = ERROR_MESSAGES.JA;

//  Mẫu tra cứu
const kanaRegex = /^[ァ-ンヴー]+$/; // Chỉ ký tự Katakana (Nhật)
const accountRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // Không có số ở đầu, chỉ chấp nhận a-z, A-Z, 0-9, _
const halfSizeNumberRegex = /^[0-9]+$/; // Chữ số Halfsize

export const employeeSchema = z.object({
  employeeLoginId: z.string()
    .min(1, err.ER001('アカウント名'))
    .max(50, err.ER006('アカウント名', 50))
    .regex(accountRegex, err.ER019()),

  employeeName: z.string()
    .min(1, err.ER001('氏名'))
    .max(125, err.ER006('氏名', 125)),

  employeeNameKana: z.string()
    .min(1, err.ER001('カタカナ氏名'))
    .max(125, err.ER006('カタカナ氏名', 125))
    .regex(kanaRegex, err.ER009('カタカナ氏名')),

  employeeBirthDate: z.string()
    .min(1, err.ER001('生年月日')),

  employeeEmail: z.string()
    .min(1, err.ER001('メールアドレス'))
    .max(125, err.ER006('メールアドレス', 125))
    .email(err.ER005('メールアドレス', 'メール')),

  employeeTelephone: z.string()
    .min(1, err.ER001('電話番号'))
    .max(50, err.ER006('電話番号', 50))
    .regex(halfSizeNumberRegex, err.ER018('電話番号')),

  departmentId: z.number({ required_error: err.ER002('グループ') }),

  // Phần password có thể rỗng khi Edit, nên để Optional hoặc điều hướng riêng bằng superRefine.
  // Ở đây chúng tôi tạo field Optional cho form dùng chung cả Add lẫn Edit.
  employeeLoginPassword: z.string()
    .min(8, err.ER007('パスワード', 8, 50))
    .max(50, err.ER007('パスワード', 8, 50))
    .optional()
    .or(z.literal('')),

  employeeLoginPasswordConfirm: z.string().optional().or(z.literal('')),

  // Chứng chỉ (Optional) - Nhưng nếu đã nhập thì kéo theo Score và Date phải validate
  certificationId: z.number().optional().nullable(),
  certificationStartDate: z.string().optional().or(z.literal('')),
  certificationEndDate: z.string().optional().or(z.literal('')),
  certificationScore: z.number().optional().nullable(),

}).superRefine((data, ctx) => {
  // Validate Password Confirm 
  if (data.employeeLoginPassword && data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
    ctx.addIssue({
      code: "custom",
      path: ['employeeLoginPasswordConfirm'],
      message: err.ER017()
    });
  }

  // Nếu người dùng chọn 1 Chứng chỉ bấp kỳ, phải nhập validate Ngày tháng và Điểm
  if (data.certificationId && data.certificationId > 0) {
    if (!data.certificationStartDate) {
      ctx.addIssue({ code: "custom", path: ['certificationStartDate'], message: err.ER001('資格交付日') });
    }
    if (!data.certificationEndDate) {
      ctx.addIssue({ code: "custom", path: ['certificationEndDate'], message: err.ER001('失効日') });
    }
    if (data.certificationScore === undefined || data.certificationScore === null) {
      ctx.addIssue({ code: "custom", path: ['certificationScore'], message: err.ER001('点数') });
    }

    // Check ngày hết hạn phải sau ngày cấp chứng chỉ (ER012)
    if (data.certificationStartDate && data.certificationEndDate) {
      const start = new Date(data.certificationStartDate);
      const end = new Date(data.certificationEndDate);
      if (end <= start) {
        ctx.addIssue({
          code: "custom",
          path: ['certificationEndDate'],
          message: err.ER012('失効日', '資格交付日')
        });
      }
    }
  }
});

export type EmployeeForm = z.infer<typeof employeeSchema>;
