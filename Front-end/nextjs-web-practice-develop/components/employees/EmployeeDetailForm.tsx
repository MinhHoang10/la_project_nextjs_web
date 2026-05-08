/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeDetailForm.tsx, 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { useADM003 } from '@/hooks/useADM003';

export default function EmployeeDetailForm() {
  const { employee, loading, handleEdit, handleBack, handleDelete } = useADM003();

  // if (loading) {
  //   return <div className="p-4 text-center font-weight-bold">Đang tải dữ liệu nhân viên...</div>;
  // }

  if (!employee) {
    return <div className="p-4 text-center text-danger">Không tìm thấy thông tin nhân viên hoặc đã bị xóa.</div>;
  }

  return (
    <form className="c-form box-shadow">
      <ul className="show-data">
        <li className="title">情報確認</li>

        {/* Thông tin cơ bản */}
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">アカウント名</label>
          <div className="col-sm col-sm-10 text-truncate-custom" title={employee.employeeLoginId}>{employee.employeeLoginId}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">グループ</label>
          <div className="col-sm col-sm-10 text-truncate-custom" title={employee.departmentName}>{employee.departmentName}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">氏名</label>
          <div className="col-sm col-sm-10 text-truncate-custom" title={employee.employeeName}>{employee.employeeName}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">カタカナ氏名</label>
          <div className="col-sm col-sm-10 text-truncate-custom" title={employee.employeeNameKana}>{employee.employeeNameKana}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">生年月日</label>
          <div className="col-sm col-sm-10">{employee.employeeBirthDate?.replaceAll('-', '/')}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">メールアドレス</label>
          <div className="col-sm col-sm-10 text-truncate-custom" title={employee.employeeEmail}>{employee.employeeEmail}</div>
        </li>
        <li className="form-group row d-flex bor-none">
          <label className="col-form-label col-sm-2">電話番号</label>
          <div className="col-sm col-sm-10">{employee.employeeTelephone}</div>
        </li>

        {/* Thông tin chứng chỉ (Luôn hiển thị) */}
        <li className="title mt-12"><a href="#!">日本語能力</a></li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">資格</label>
          <div className="col-sm col-sm-10 text-truncate-custom" title={employee.certifications && employee.certifications.length > 0 ? employee.certifications[0].certificationName : ''}>
            {employee.certifications && employee.certifications.length > 0 ? employee.certifications[0].certificationName : ''}
          </div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">資格交付日</label>
          <div className="col-sm col-sm-10">
            {employee.certifications && employee.certifications.length > 0 ? employee.certifications[0].startDate?.replaceAll('-', '/') : ''}
          </div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">失効日</label>
          <div className="col-sm col-sm-10">
            {employee.certifications && employee.certifications.length > 0 ? employee.certifications[0].endDate?.replaceAll('-', '/') : ''}
          </div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">点数</label>
          <div className="col-sm col-sm-10">
            {employee.certifications && employee.certifications.length > 0 ? employee.certifications[0].score : ''}
          </div>
        </li>

        {/* Nhóm nút bấm hành động */}
        <li className="form-group row d-flex">
          <div className="btn-group col-sm col-sm-10 ml">
            <button
              type="button"
              onClick={handleEdit}
              className="btn btn-primary btn-sm"
            >
              編集
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-secondary btn-sm"
            >
              削除
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary btn-sm"
            >
              戻る
            </button>
          </div>
        </li>
      </ul>
    </form>
  );
}
