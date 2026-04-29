/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx (ADM006), 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

/**
 * Trang thông báo hoàn tất xử lý (ADM006).
 */
export default function EmployeeCompletePage() {
  useAuth();
  const router = useRouter();
  return (
    <div className="box-shadow">
      <div className="notification-box">
        <h1 className="msg-title">ユーザの登録が完了しました。 or ユーザの更新が完了しました。 or ユーザの削除が完了しました。</h1>
        <div className="notification-box-btn">
          <button type="button" onClick={() => router.push('/employees/adm002')} className="btn btn-primary btn-sm">OK</button>
        </div>
      </div>
    </div>
  );
}

