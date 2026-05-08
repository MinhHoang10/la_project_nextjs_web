# Dự án Quản lý Nhân viên - Frontend (Next.js)

Dự án này là bản triển khai Frontend cho hệ thống Quản lý Nhân viên sử dụng Next.js.

## Khởi động

Đầu tiên, chạy server phát triển (development server):

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

## Yêu cầu hệ thống

- Node.js 18+
- Backend API đang chạy tại `http://localhost:8085`

## Biến môi trường

Tạo file `.env.local` ở thư mục gốc của dự án và thêm nội dung sau:

```env
NEXT_PUBLIC_API_URL=http://localhost:8085
```

## Chi tiết triển khai

- **Framework**: Next.js 16.0.8 (App Router)
- **API Client**: Axios 1.13.2
- **Xử lý Form**: React Hook Form + Zod

### Các tính năng đã thực hiện

- **Xác thực người dùng**: Triển khai đầy đủ chức năng đăng nhập và đăng xuất.
- **Quản lý nhân viên**: Các thao tác CRUD bao gồm danh sách (ADM002), thêm mới (ADM004/005), và thông báo hoàn tất (ADM006).

## Cấu trúc thư mục & Chức năng

### `app/`
- `(protected)/employees/`: Chứa các trang quản lý nhân viên (ADM002 đến ADM006).
- `(auth)/login/`: Các trang liên quan đến đăng nhập.

### `components/employees/`
- `EmployeeListForm.tsx`: Giao diện trang danh sách nhân viên (ADM002).
- `EmployeeInputForm.tsx`: Giao diện trang nhập liệu nhân viên (ADM004).
- `EmployeeConfirmForm.tsx`: Giao diện trang xác nhận thông tin nhân viên (ADM005).
- `EmployeeCompleteContent.tsx`: Giao diện trang thông báo hoàn tất xử lý (ADM006).

### `hooks/`
- `useADM002.ts`: Xử lý logic tìm kiếm, phân trang và sắp xếp.
- `useADM004.ts`: Xử lý logic nhập và xác nhận thông tin nhân viên.
- `useADM005.ts`: Xử lý logic gửi dữ liệu lên Backend.

### `lib/`
- `api/`: Các dịch vụ gọi API và cấu hình Axios.
- `constants/`: Các hằng số dùng chung trong ứng dụng.
- `validations/`: Các schema dùng để validate form bằng Zod.
