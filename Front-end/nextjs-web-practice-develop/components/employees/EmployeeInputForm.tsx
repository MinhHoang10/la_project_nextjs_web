/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeInputForm.tsx, 4/13/2026 NguyenHuyHoang
 */

'use client';

import { useRef } from 'react';

import { useADM004 } from '@/hooks/useADM004';
import { resolveErrorMessage } from '@/lib/validation/employee';
import { EmployeeFormDTO } from '@/types/employee';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from 'date-fns';
import { getEmployeeLabel } from '@/lib/validation/employee';
import { APP_MODES } from '@/lib/constants/common';

// ──────────────────────────────────────────────
// Hiển thị thông báo lỗi dưới mỗi ô input
// ──────────────────────────────────────────────
function FieldError({
  errorCode,
  fieldKey,
}: {
  errorCode?: string;
  fieldKey: keyof EmployeeFormDTO;
}) {
  if (!errorCode) return null;

  // Nếu là mã lỗi (bắt đầu bằng ER), ta resolve qua mapping cũ (cho Backend hoặc các case cũ)
  // Nếu đã là câu thông báo (do Zod trả về), ta hiển thị luôn.
  const isCode = errorCode.startsWith('ER');
  const message = isCode ? resolveErrorMessage(errorCode, fieldKey) : errorCode;

  return <span className="error-message">{message}</span>;
}

// ──────────────────────────────────────────────
// Form chính
// ──────────────────────────────────────────────
export default function EmployeeInputForm() {
  const {
    departments,
    certifications,
    loadingInitial,
    mode,
    formData,
    errors,
    updateAndValidateField,
    validateFieldOnBlur,
    handleConfirm,
    handleBack,
    handleCertificationChange,
  } = useADM004();

  const birthDateRef = useRef<DatePicker>(null);
  const certificationStartDateRef = useRef<DatePicker>(null);
  const certificationEndDateRef = useRef<DatePicker>(null);

  // Kiểm tra xem có phải chế độ EDIT (hoặc BACK sau khi đã có dữ liệu Employee) không
  const isEditMode = mode === APP_MODES.EDIT || (mode === APP_MODES.BACK && !!formData.employeeId);

  // Đồng bộ date strings và Date objects cho react-datepicker
  const getDateObj = (dateStr?: string) => {
    if (!dateStr) return null;
    const parsed = parse(dateStr, 'yyyy/MM/dd', new Date());
    return isNaN(parsed.getTime()) ? null : parsed;
  };
  const getDateStr = (date: Date | null) =>
    date ? format(date, 'yyyy/MM/dd') : '';

  // Xác định xem đã chọn chứng chỉ hay chưa
  const hasCertification = !!formData.certificationId;

  if (loadingInitial) {
    return <div className="text-center p-4">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul>
          <li className="title">
            {mode === APP_MODES.EDIT ? '会員情報編集' : '会員情報入力'}
          </li>
          {/* ── アカウント名 (LoginId) — ER001, ER006, ER019 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('employeeLoginId')}:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                id="employeeLoginId"
                className={`form-control${errors.employeeLoginId ? ' is-invalid' : ''}`}
                value={formData.employeeLoginId || ''}
                disabled={isEditMode}
                onChange={(e) => updateAndValidateField('employeeLoginId', e.target.value)}
                onBlur={() => validateFieldOnBlur('employeeLoginId')}
              />
              <FieldError errorCode={errors.employeeLoginId} fieldKey="employeeLoginId" />
            </div>
          </li>

          {/* ── グループ (departmentId) — ER002 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('departmentId')}:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <select
                id="departmentId"
                className={`form-control${errors.departmentId ? ' is-invalid' : ''}`}
                value={formData.departmentId || ''}
                onChange={(e) =>
                  updateAndValidateField('departmentId', Number(e.target.value))
                }
                onBlur={() => validateFieldOnBlur('departmentId')}
              >
                <option value="">選択してください</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              <FieldError errorCode={errors.departmentId} fieldKey="departmentId" />
            </div>
          </li>

          {/* ── 氏名 (Name) — ER001, ER006 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('employeeName')}:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                id="employeeName"
                className={`form-control${errors.employeeName ? ' is-invalid' : ''}`}
                value={formData.employeeName || ''}
                onChange={(e) => updateAndValidateField('employeeName', e.target.value)}
                onBlur={() => validateFieldOnBlur('employeeName')}
              />
              <FieldError errorCode={errors.employeeName} fieldKey="employeeName" />
            </div>
          </li>

          {/* ── カタカナ氏名 (NameKatakana) — ER001, ER006, ER009 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('employeeNameKana')}:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                id="employeeNameKana"
                className={`form-control${errors.employeeNameKana ? ' is-invalid' : ''}`}
                value={formData.employeeNameKana || ''}
                onChange={(e) =>
                  updateAndValidateField('employeeNameKana', e.target.value)
                }
                onBlur={() => validateFieldOnBlur('employeeNameKana')}
              />
              <FieldError errorCode={errors.employeeNameKana} fieldKey="employeeNameKana" />
            </div>
          </li>

          {/* ── 生年月日 (BirthDate) — ER001 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('employeeBirthDate')}:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <div className="d-flex">
                <div className="datepicker-wrapper">
                  <DatePicker
                    ref={birthDateRef}
                    // readOnly
                    placeholderText="yyyy/MM/dd"
                    selected={getDateObj(formData.employeeBirthDate)}
                    onChange={(date: Date | null) => {
                      updateAndValidateField('employeeBirthDate', getDateStr(date));
                    }}
                    dateFormat="yyyy/MM/dd"
                    onKeyDown={(e) => e.preventDefault()}
                    onBlur={() => validateFieldOnBlur('employeeBirthDate')}
                    className={`form-control${errors.employeeBirthDate ? ' is-invalid' : ''}`}
                  />
                  <span
                    className="glyphicon glyphicon-calendar"
                    onClick={() => birthDateRef.current?.setFocus()}
                  />
                </div>
              </div>
              <FieldError errorCode={errors.employeeBirthDate} fieldKey="employeeBirthDate" />
            </div>
          </li>

          {/* ── メールアドレス (Email) — ER001, ER005, ER006 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('employeeEmail')}:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                id="employeeEmail"
                className={`form-control${errors.employeeEmail ? ' is-invalid' : ''}`}
                value={formData.employeeEmail || ''}
                onChange={(e) => updateAndValidateField('employeeEmail', e.target.value)}
                onBlur={() => validateFieldOnBlur('employeeEmail')}
              />
              <FieldError errorCode={errors.employeeEmail} fieldKey="employeeEmail" />
            </div>
          </li>

          {/* ── 電話番号 (Telephone) — ER001, ER006, ER008 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('employeeTelephone')}:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                id="employeeTelephone"
                className={`form-control${errors.employeeTelephone ? ' is-invalid' : ''}`}
                value={formData.employeeTelephone || ''}
                onChange={(e) =>
                  updateAndValidateField('employeeTelephone', e.target.value)
                }
                onBlur={() => validateFieldOnBlur('employeeTelephone')}
              />
              <FieldError errorCode={errors.employeeTelephone} fieldKey="employeeTelephone" />
            </div>
          </li>

          {/* ── パスワード (LoginPassword) — chỉ hiển thị khi thêm mới ── */}
          {!isEditMode && (
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">
                <i className="relative">{getEmployeeLabel('employeeLoginPassword')}:<span className="note-red">*</span></i>
              </label>
              <div className="col-sm col-sm-10">
                <input
                  type="password"
                  id="employeeLoginPassword"
                  // placeholder="●●●●●●●●●●"
                  className={`form-control${errors.employeeLoginPassword ? ' is-invalid' : ''}`}
                  value={formData.employeeLoginPassword || ''}
                  onChange={(e) =>
                    updateAndValidateField('employeeLoginPassword', e.target.value)
                  }
                  onBlur={() => validateFieldOnBlur('employeeLoginPassword')}
                />
                <FieldError errorCode={errors.employeeLoginPassword} fieldKey="employeeLoginPassword" />
              </div>
            </li>
          )}

          {/* ── パスワード（確認） (ConfirmPassword) — chỉ hiển thị khi thêm mới ── */}
          {!isEditMode && (
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">
                <i className="relative">{getEmployeeLabel('employeeLoginPasswordConfirm')}:</i>
              </label>
              <div className="col-sm col-sm-10">
                <input
                  type="password"
                  id="employeeLoginPasswordConfirm"
                  // placeholder="●●●●●●●●●●"
                  className={`form-control${errors.employeeLoginPasswordConfirm ? ' is-invalid' : ''}`}
                  value={formData.employeeLoginPasswordConfirm || ''}
                  onChange={(e) =>
                    updateAndValidateField('employeeLoginPasswordConfirm', e.target.value)
                  }
                  onBlur={() => validateFieldOnBlur('employeeLoginPasswordConfirm')}
                />
                <FieldError
                  errorCode={errors.employeeLoginPasswordConfirm}
                  fieldKey="employeeLoginPasswordConfirm"
                />
              </div>
            </li>
          )}

          {/* ── 日本語能力 section ── */}
          <li className="title mt-12">
            <a href="#!">日本語能力</a>
          </li>

          {/* ── 資格 (certificationId) ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('certificationId')}:</i>
            </label>
            <div className="col-sm col-sm-10">
              <select
                id="certificationId"
                className={`form-control${errors.certificationId ? ' is-invalid' : ''}`}
                value={formData.certificationId || ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  // Dùng handleCertificationChange để đồng thời reset certificationId và 3 trường con
                  handleCertificationChange(val);
                }}
                onBlur={() => validateFieldOnBlur('certificationId')}
              >
                <option value="">選択してください</option>
                {certifications.map((cert) => (
                  <option key={cert.certificationId} value={cert.certificationId}>
                    {cert.certificationName}
                  </option>
                ))}
              </select>
              <FieldError errorCode={errors.certificationId} fieldKey="certificationId" />
            </div>
          </li>

          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('certificationStartDate')}:{hasCertification && <span className="note-red">*</span>}</i>
            </label>
            <div className="col-sm col-sm-10">
              <div className="d-flex">
                <div className="datepicker-wrapper">
                  <DatePicker
                    ref={certificationStartDateRef}
                    placeholderText="yyyy/MM/dd"
                    selected={getDateObj(formData.certificationStartDate)}
                    onChange={(date: Date | null) => {
                      updateAndValidateField('certificationStartDate', getDateStr(date));
                    }}
                    dateFormat="yyyy/MM/dd"
                    disabled={!hasCertification}
                    onBlur={() => validateFieldOnBlur('certificationStartDate')}
                    className={`form-control${errors.certificationStartDate ? ' is-invalid' : ''}`}
                  />
                  <span
                    className="glyphicon glyphicon-calendar"
                    onClick={() => {
                      if (hasCertification) certificationStartDateRef.current?.setFocus();
                    }}
                  />
                </div>
              </div>
              <FieldError
                errorCode={errors.certificationStartDate}
                fieldKey="certificationStartDate"
              />
            </div>
          </li>

          {/* ── 失効日 (endDate) ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('certificationEndDate')}:{hasCertification && <span className="note-red">*</span>}</i>
            </label>
            <div className="col-sm col-sm-10">
              <div className="d-flex">
                <div className="datepicker-wrapper">
                  <DatePicker
                    ref={certificationEndDateRef}
                    placeholderText="yyyy/MM/dd"
                    selected={getDateObj(formData.certificationEndDate)}
                    onChange={(date: Date | null) => {
                      updateAndValidateField('certificationEndDate', getDateStr(date));
                    }}
                    dateFormat="yyyy/MM/dd"
                    disabled={!hasCertification}
                    onBlur={() => validateFieldOnBlur('certificationEndDate')}
                    className={`form-control${errors.certificationEndDate ? ' is-invalid' : ''}`}
                  />
                  <span
                    className="glyphicon glyphicon-calendar"
                    onClick={() => {
                      if (hasCertification) certificationEndDateRef.current?.setFocus();
                    }}
                  />
                </div>
              </div>
              <FieldError
                errorCode={errors.certificationEndDate}
                fieldKey="certificationEndDate"
              />
            </div>
          </li>

          {/* ── 点数 (score) — always visible, disabled when no cert ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">{getEmployeeLabel('certificationScore')}:{hasCertification && <span className="note-red">*</span>}</i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                id="certificationScore"
                className={`form-control${errors.certificationScore ? ' is-invalid' : ''}`}
                value={formData.certificationScore ?? ''}
                disabled={!hasCertification}
                onChange={(e) =>
                  updateAndValidateField('certificationScore', e.target.value)
                }
                onBlur={() => validateFieldOnBlur('certificationScore')}
              />
              <FieldError
                errorCode={errors.certificationScore}
                fieldKey="certificationScore"
              />
            </div>
          </li>

          {/* ── Action buttons ── */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button
                type="button"
                id="btn-confirm"
                onClick={handleConfirm}
                className="btn btn-primary btn-sm"
              >
                確認
              </button>
              <button
                type="button"
                id="btn-back"
                onClick={handleBack}
                className="btn btn-secondary btn-sm"
              >
                戻る
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
