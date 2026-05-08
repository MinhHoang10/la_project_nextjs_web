/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeConfirmForm.tsx, 4/13/2026 NguyenHuyHoang
 */
'use client';

import { useADM005 } from '@/hooks/useADM005';
import { getEmployeeLabel } from '@/lib/validation/employee';

/**
 * Component hiển thị màn hình xác nhận thông tin nhân viên (ADM005).
 * Dữ liệu được lấy từ session thông qua hook useADM005.
 */
export default function EmployeeConfirmForm() {
  const { loadingInitial, employeeData, departments, certifications, handleBack, handleOK } = useADM005();

  if (loadingInitial || !employeeData) {
    return null;
  }

  // Tra cứu tên phòng ban từ master data
  const departmentName = departments.find(d => d.departmentId === Number(employeeData.departmentId))?.departmentName || '';

  // Tra cứu tên chứng chỉ từ master data
  const certificationName = certifications.find(c => c.certificationId === Number(employeeData.certificationId))?.certificationName || '';

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">
            <p>情報確認</p>
            <p>入力された情報をＯＫボタンクリックでＤＢへ保存してください</p>
          </li>

          {/* ── アカウント名 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeLoginId')}</label>
            <div className="col-sm col-sm-10 text-truncate-custom" title={employeeData.employeeLoginId}>{employeeData.employeeLoginId}</div>
          </li>

          {/* ── グループ ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('departmentId')}</label>
            <div className="col-sm col-sm-10 text-truncate-custom" title={departmentName}>{departmentName}</div>
          </li>

          {/* ── 氏名 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeName')}</label>
            <div className="col-sm col-sm-10 text-truncate-custom" title={employeeData.employeeName}>{employeeData.employeeName}</div>
          </li>

          {/* ── カタカナ氏名 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeNameKana')}</label>
            <div className="col-sm col-sm-10 text-truncate-custom" title={employeeData.employeeNameKana}>{employeeData.employeeNameKana}</div>
          </li>

          {/* ── 生年月日 ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeBirthDate')}</label>
            <div className="col-sm col-sm-10">{employeeData.employeeBirthDate}</div>
          </li>

          {/* ── メールアドレス ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeEmail')}</label>
            <div className="col-sm col-sm-10 text-truncate-custom" title={employeeData.employeeEmail}>{employeeData.employeeEmail}</div>
          </li>

          {/* ── 電話番号 ── */}
          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeTelephone')}</label>
            <div className="col-sm col-sm-10">{employeeData.employeeTelephone}</div>
          </li>

          {/* ── 日本語能力 — luôn hiển thị, blank nếu không có chứng chỉ ── */}
          <li className="title mt-12"><a href="#!">{getEmployeeLabel('certificationName')}</a></li>

          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationId')}</label>
            <div className="col-sm col-sm-10 text-truncate-custom" title={certificationName}>{certificationName}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationStartDate')}</label>
            <div className="col-sm col-sm-10">{employeeData.certificationStartDate}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationEndDate')}</label>
            <div className="col-sm col-sm-10">{employeeData.certificationEndDate}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationScore')}</label>
            <div className="col-sm col-sm-10">{employeeData.certificationScore}</div>
          </li>

          {/* ── Nút hành động ── */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={handleOK} className="btn btn-primary btn-sm">OK</button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
