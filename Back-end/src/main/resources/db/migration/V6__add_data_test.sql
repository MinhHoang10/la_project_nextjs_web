-- Tạo 5 nhân viên cùng tên 'SortTest' để kiểm tra trình tự
INSERT INTO employees (department_id, employee_name, employee_email, employee_login_id, employee_login_password, employee_role, employee_name_kana, employee_birth_date, employee_telephone) 
VALUES (1, 'SortTest1', 'st1@luvina.net', 'sort1', 'password', 1, 'SORT KANA', '1990-01-01', '0123456789');
SET @s1 = LAST_INSERT_ID();

INSERT INTO employees (department_id, employee_name, employee_email, employee_login_id, employee_login_password, employee_role, employee_name_kana, employee_birth_date, employee_telephone) 
VALUES (1, 'SortTest', 'st2@luvina.net', 'sort2', 'password', 1, 'SORT KANA', '1990-01-01', '0123456789');
SET @s2 = LAST_INSERT_ID();

INSERT INTO employees (department_id, employee_name, employee_email, employee_login_id, employee_login_password, employee_role, employee_name_kana, employee_birth_date, employee_telephone) 
VALUES (1, 'SortTest', 'st3@luvina.net', 'sort3', 'password', 1, 'SORT KANA', '1990-01-01', '0123456789');
SET @s3 = LAST_INSERT_ID();

INSERT INTO employees (department_id, employee_name, employee_email, employee_login_id, employee_login_password, employee_role, employee_name_kana, employee_birth_date, employee_telephone) 
VALUES (1, 'SortTest', 'st4@luvina.net', 'sort4', 'password', 1, 'SORT KANA', '1990-01-01', '0123456789');
SET @s4 = LAST_INSERT_ID();

INSERT INTO employees (department_id, employee_name, employee_email, employee_login_id, employee_login_password, employee_role, employee_name_kana, employee_birth_date, employee_telephone) 
VALUES (1, 'SortTest', 'st5@luvina.net', 'sort5', 'password', 1, 'SORT KANA', '1990-01-01', '0123456789');
SET @s5 = LAST_INSERT_ID();
