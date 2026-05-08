'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { COMPLETION_MESSAGES, EMPLOYEE_COMPLETE_MESSAGE_MAP } from '@/lib/constants/common';

/**
 * Component hiển thị nội dung thông báo hoàn tất (ADM006).
 */
export default function EmployeeCompleteContent() {
  useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const message = (mode && EMPLOYEE_COMPLETE_MESSAGE_MAP[mode]) || COMPLETION_MESSAGES.DEFAULT;

  return (
    <div className="box-shadow">
      <div className="notification-box">
        <h1 className="msg-title">{message}</h1>
        <div className="notification-box-btn">
          <button 
            type="button" 
            onClick={() => router.push('/employees/adm002')} 
            className="btn btn-primary btn-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
