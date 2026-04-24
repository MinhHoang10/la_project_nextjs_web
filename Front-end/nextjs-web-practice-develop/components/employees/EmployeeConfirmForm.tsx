/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeConfirmForm.tsx, 4/13/2026 NguyenHuyHoang
 */
'use client';

import { useADM005 } from '@/hooks/useADM005';
import { useADM004 } from '@/hooks/useADM004';
import { useEffect, useState } from 'react';
import { getEmployeeLabel } from '@/lib/validation/employee';

export default function EmployeeConfirmForm() {
  const { getEmployeeFromSession, handleBack, handleOK } = useADM005();
  const { departments, certifications } = useADM004(); // Sử dụng logic tải dữ liệu danh sách từ ADM004
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const sessionData = getEmployeeFromSession();
    setData(sessionData);
  }, []);

  if (!data) {
    return <div className="text-center p-4">Không tìm thấy dữ liệu xác nhận.</div>;
  }

  const departmentName = departments.find(d => d.departmentId === data.departmentId)?.departmentName || '';
  const certificationName = certifications.find(c => c.certificationId === data.certificationId)?.certificationName || '';

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">
            <p>情報確認</p>
            <p>入力された情報をＯＫボタンクリックでＤＢへ保存してください</p>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeLoginId')}</label>
            <div className="col-sm col-sm-10">{data.employeeLoginId}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('departmentId')}</label>
            <div className="col-sm col-sm-10">{departmentName}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeName')}</label>
            <div className="col-sm col-sm-10">{data.employeeName}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeNameKana')}</label>
            <div className="col-sm col-sm-10">{data.employeeNameKana}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeBirthDate')}</label>
            <div className="col-sm col-sm-10">{data.employeeBirthDate}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeEmail')}</label>
            <div className="col-sm col-sm-10">{data.employeeEmail}</div>
          </li>
          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">{getEmployeeLabel('employeeTelephone')}</label>
            <div className="col-sm col-sm-10">{data.employeeTelephone}</div>
          </li>

          {data.certificationId && (
            <>
              <li className="title mt-12"><a href="#!">{getEmployeeLabel('certificationName')}</a></li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationId')}</label>
                <div className="col-sm col-sm-10">{certificationName}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationStartDate')}</label>
                <div className="col-sm col-sm-10">{data.certificationStartDate}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationEndDate')}</label>
                <div className="col-sm col-sm-10">{data.certificationEndDate}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">{getEmployeeLabel('certificationScore')}</label>
                <div className="col-sm col-sm-10">{data.certificationScore}</div>
              </li>
            </>
          )}

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
