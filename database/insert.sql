USE TiemTraChanh1997;

-- Thêm dữ liệu vào bảng Vai trò
INSERT INTO vai_tro (ten_vai_tro) VALUES
('Quản trị viên'),
('Nhân viên');

-- Thêm dữ liệu vào bảng Người dùng
-- Mật khẩu: 123456
-- INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai, id_vai_tro) VALUES
-- ('admin', '$2a$10$wNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXw', 'Nguyễn Văn A', 'admin@example.com', '0987654321', 1), -- id_vai_tro = 1 (Quản trị viên)
-- ('nv_lam', '$2a$10$wNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXw', 'Nguyễn Thị B', 'lam@example.com', '0123456789', 2); -- id_vai_tro = 2 (Nhân viên)

-- Thêm dữ liệu vào bảng Nhà cung cấp
INSERT INTO nha_cung_cap (ten_ncc, dia_chi, so_dien_thoai) VALUES
('Công ty Trà Xanh', 'Hà Nội', '09481234567'),
('Kho Nguyên Liệu Tổng Hợp', 'Hưng yên', '0989876543');

-- Thêm dữ liệu vào bảng Nguyên liệu
INSERT INTO nguyen_lieu (ten_nguyen_lieu, don_vi) VALUES
('Trà Đen', 'kg'),
('Chanh', 'kg'),
('Đường', 'kg'),
('Đào', 'kg'),
('Vải', 'kg');

-- Thêm dữ liệu vào bảng Loại sản phẩm
INSERT INTO loai_san_pham (ten_loai) VALUES
('Đồ uống'),
('Đồ ăn vặt');

-- Thêm dữ liệu vào bảng Sản phẩm
INSERT INTO san_pham (ten_san_pham, gia_ban, mo_ta, id_loai) VALUES
('Trà Chanh', 15000, 'Trà chanh truyền thống', 1),
('Trà Đào Cam Sả', 25000, 'Trà đào thơm ngon', 1),
('Trà Vải', 20000, 'Trà vải tươi mát', 1),
('Hướng Dương', 10000, 'Hạt hướng dương rang muối', 2),
('Khô Gà', 20000, 'Khô gà lá chanh', 2);

-- Thêm dữ liệu vào bảng Hóa đơn nhập và Chi tiết hóa đơn nhập
-- INSERT INTO hoa_don_nhap (id_ncc, id_nguoi_dung, ngay_nhap, tong_tien) VALUES
-- (1, 1, '2025-09-01 10:00:00', 500000),
-- (2, 1, '2025-09-05 15:30:00', 800000);

-- INSERT INTO chi_tiet_hoa_don_nhap (id_hoa_don_nhap, id_nguyen_lieu, so_luong, don_gia, thanh_tien) VALUES
-- (1, 1, 10, 50000, 500000), -- Trà đen: 10kg, giá 50k/kg
-- (2, 2, 5, 20000, 100000),  -- Chanh: 5kg, giá 20k/kg
-- (2, 3, 20, 15000, 300000),  -- Đường: 20kg, giá 15k/kg
-- (2, 4, 8, 50000, 400000);  -- Đào: 8kg, giá 50k/kg

-- Thêm dữ liệu vào bảng Bàn
INSERT INTO ban (ten_ban) VALUES
('Bàn 01'), ('Bàn 02'), ('Bàn 03'), ('Bàn 04'), ('Bàn 05');

-- Thêm dữ liệu vào bảng Công thức
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(1, 1, 0.05), -- Trà chanh cần 0.05kg Trà đen
(1, 2, 0.1),  -- Trà chanh cần 0.1kg Chanh
(1, 3, 0.05), -- Trà chanh cần 0.05kg Đường
(2, 1, 0.05), -- Trà đào cần 0.05kg Trà đen
(2, 4, 0.2),  -- Trà đào cần 0.2kg Đào
(2, 3, 0.05); -- Trà đào cần 0.05kg Đường

-- Thêm dữ liệu vào bảng Hóa đơn bán và Chi tiết hóa đơn bán
-- INSERT INTO hoa_don_ban (id_ban, id_nguoi_dung, ngay_lap, tong_tien) VALUES
-- (1, 2, '2025-09-15 19:30:00', 40000),
-- (2, 2, '2025-09-15 20:15:00', 25000);

-- INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
-- (1, 1, 1, 15000, 15000), -- 1 Trà chanh
-- (1, 2, 1, 25000, 25000), -- 1 Trà đào
-- (2, 2, 1, 25000, 25000); -- 1 Trà đào