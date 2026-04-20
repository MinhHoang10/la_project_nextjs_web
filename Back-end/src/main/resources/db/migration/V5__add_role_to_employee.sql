-- Thêm cột role vào bảng employees (0: User, 1: Admin)
ALTER TABLE employees ADD COLUMN employee_role INT(11) DEFAULT 1 NOT NULL;

-- Đánh dấu tài khoản admin hiện tại với role 1
UPDATE employees SET employee_role = 0 WHERE employee_login_id = 'admin';
