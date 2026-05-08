import { redirect } from 'next/navigation';

export default function Home(): never {
  // Tự động chuyển hướng người dùng từ trang chủ gốc (/) sang trang danh sách nhân viên
  redirect('/employees/adm002');
}
