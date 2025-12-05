USE TiemTraChanh1997;

-- Thêm dữ liệu vào bảng Vai trò
INSERT INTO vai_tro (ten_vai_tro) VALUES
('Quản trị viên'),
('Nhân viên');

-- Thêm dữ liệu vào bảng Người dùng
-- Mật khẩu: 123456
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai, id_vai_tro) VALUES
('admin', '$2a$10$wNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXw', 'Nguyễn Văn A', 'admin@example.com', '0987654321', 1), -- id_vai_tro = 1 (Quản trị viên)
('nv_lam', '$2a$10$wNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXwNnI.qXw', 'Nguyễn Thị B', 'lam@example.com', '0123456789', 2); -- id_vai_tro = 2 (Nhân viên)

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
('Vải', 'kg'),
('Bột Kem Béo', 'kg'),
('Sữa Đặc', 'lon'),
('Cà Phê Rang Xay', 'kg'),
('Bột Năng', 'kg'),
('Siro Chanh Dây', 'chai'),
('Trà Ô Long', 'kg'),
('Bột Cacao', 'kg'),
('Sữa Tươi Không Đường', 'lít'),
('Bột Matcha', 'kg');

-- Thêm dữ liệu vào bảng Loại sản phẩm
INSERT INTO loai_san_pham (ten_loai, mo_ta) VALUES
('Trà sữa', 'Các loại trà sữa béo thơm, nhiều hương vị, kết hợp cùng các loại topping đa dạng.'),
('Đồ ăn vặt', 'Các món ăn nhẹ, ăn kèm hoặc ăn chơi hấp dẫn, phù hợp cho mọi lứa tuổi.'),
('Coffee', 'Các món cà phê truyền thống và hiện đại, từ cà phê phin đậm đà đến espresso.'),
('Trà Hoa Quả', 'Các loại trà kết hợp với trái cây tươi, syrup hoặc mứt, mang lại vị thanh mát.'),
('Topping', 'Các loại trân châu, thạch, pudding, kem cheese dùng kèm với đồ uống.'),
('Đồ Uống Khác', 'Các món đặc biệt hoặc món phụ như Cacao, Matcha, Sữa Tươi Đường Đen.');

-- Thêm dữ liệu vào bảng Sản phẩm
INSERT INTO san_pham (ten_san_pham, gia_ban, mo_ta, id_loai) VALUES
('Trà Chanh', 15000, 'Trà chanh truyền thống', 1),
('Trà Đào Cam Sả', 25000, 'Trà đào thơm ngon', 1),
('Trà Vải', 20000, 'Trà vải tươi mát', 1),
('Hướng Dương', 10000, 'Hạt hướng dương rang muối', 2),
('Khô Gà', 20000, 'Khô gà lá chanh', 2),
-- Trà Sữa (id_loai = 1)
('Trà Sữa Truyền Thống', 25000, 'Trà sữa hương vị đậm đà, béo ngậy.', 1),
('Sữa Tươi Trân Châu Đường Đen', 35000, 'Sữa tươi kem béo kết hợp trân châu đường đen.', 1),
('Trà Sữa Ô Long', 28000, 'Trà sữa từ trà Ô Long có hương thơm đặc trưng.', 1),
-- Coffee (id_loai = 3)
('Cà Phê Đen Đá', 18000, 'Cà phê rang xay truyền thống, đậm đà.', 3),
('Cà Phê Sữa Đá', 22000, 'Cà phê sữa béo thơm, chuẩn vị Việt.', 3),
('Latte Đá', 35000, 'Cà phê espresso với sữa tươi.', 3),
-- Topping (id_loai = 5)
('Trân Châu Đen', 5000, 'Topping truyền thống, dẻo dai.', 5),
('Thạch Trà Đen', 7000, 'Thạch vị trà đen mát lạnh.', 5),
-- Đồ Uống Khác (id_loai = 6)
('Cacao Đá Xay', 40000, 'Cacao đá xay mát lạnh, phủ kem.', 6),
('Matcha Latte Nóng', 30000, 'Đồ uống kết hợp bột matcha và sữa tươi.', 6);

-- Thêm dữ liệu vào bảng Hóa đơn nhập và Chi tiết hóa đơn nhập
INSERT INTO hoa_don_nhap (id_ncc, ngay_nhap, tong_tien) VALUES
(1,  '2025-09-01 10:00:00', 500000),
(2,  '2025-09-05 15:30:00', 800000);

INSERT INTO chi_tiet_hoa_don_nhap (id_hoa_don_nhap, id_nguyen_lieu, so_luong, don_gia, thanh_tien) VALUES
(1, 1, 10, 50000, 500000), -- Trà đen: 10kg, giá 50k/kg
(2, 2, 5, 20000, 100000),  -- Chanh: 5kg, giá 20k/kg
(2, 3, 20, 15000, 300000),  -- Đường: 20kg, giá 15k/kg
(2, 4, 8, 50000, 400000);  -- Đào: 8kg, giá 50k/kg

-- Thêm khu vực 
INSERT INTO khu_vuc (ten_khu_vuc, mo_ta) VALUES ('Khu A', 'Trong nhà, có máy lạnh');
INSERT INTO khu_vuc (ten_khu_vuc, mo_ta) VALUES ('Khu B', 'Khu vực ngoài trời');

-- Thêm dữ liệu vào bảng Bàn
INSERT INTO ban (ten_ban, id_khu_vuc) VALUES
('Bàn 01','1'), ('Bàn 02','1'), ('Bàn 03','1'), ('Bàn 04','1'), ('Bàn 05','1'),
('Bàn 06','2'), ('Bàn 07','2'), ('Bàn 08','2'), ('Bàn 09','2'), ('Bàn 10','2');

-- Thêm dữ liệu vào bảng Công thức
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(1, 1, 0.05), 
(1, 2, 0.1),  
(1, 3, 0.05), -- Trà chanh cần 0.05kg Đường
(2, 1, 0.05), 
(2, 4, 0.2),  
(2, 3, 0.05); 

-- Thêm dữ liệu vào bảng Hóa đơn bán và Chi tiết hóa đơn bán
INSERT INTO hoa_don_ban (id_ban, ngay_lap, tong_tien) VALUES
(1,  '2025-09-15 19:30:00', 40000),
(2,  '2025-09-15 20:15:00', 25000);

INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(1, 1, 1, 15000, 15000), -- 1 Trà chanh
(1, 2, 1, 25000, 25000), -- 1 Trà đào
(2, 2, 1, 25000, 25000); -- 1 Trà đào

-- =====================bổ sung======================
INSERT INTO hoa_don_ban (ngay_lap, tong_tien) VALUES
('2025-09-02 10:15:00', 40000),
('2025-09-03 14:30:00', 60000),
('2025-09-05 09:45:00', 30000),
('2025-09-07 16:20:00', 85000),
('2025-09-10 11:10:00', 25000),
('2025-09-12 13:00:00', 70000),
('2025-09-15 17:30:00', 55000),
('2025-09-18 08:50:00', 45000),
('2025-09-20 12:40:00', 95000),
('2025-09-22 19:05:00', 35000),
('2025-09-25 10:00:00', 65000),
('2025-09-28 15:15:00', 50000),
('2025-10-01 11:25:00', 75000),
('2025-10-03 14:55:00', 40000),
('2025-10-06 18:30:00', 80000),
('2025-10-10 09:20:00', 30000),
('2025-10-15 13:45:00', 90000),
('2025-10-20 16:10:00', 55000),
('2025-10-25 12:00:00', 60000),
('2025-10-30 17:40:00', 70000);


-- Hóa đơn 1: Trà Chanh (2 ly)
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(1, 1, 2, 15000, 30000),
(1, 12, 2, 5000, 10000);

-- Hóa đơn 2: Trà Sữa Truyền Thống + Trân Châu Đen
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(2, 6, 2, 25000, 50000),
(2, 12, 2, 5000, 10000);

-- Hóa đơn 3: Trà Vải (1 ly)
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(3, 3, 1, 20000, 20000),
(3, 13, 1, 7000, 7000),
(3, 4, 1, 10000, 3000); -- Làm tròn để tổng là 30000

-- Hóa đơn 4: Trà Đào + Sữa Tươi Trân Châu + Khô Gà
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(4, 2, 1, 25000, 25000),
(4, 7, 1, 35000, 35000),
(4, 5, 1, 20000, 20000),
(4, 12, 1, 5000, 5000); -- Tổng = 85k

-- Hóa đơn 5: Trà Chanh (1 ly)
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(5, 1, 1, 15000, 15000),
(5, 13, 1, 7000, 7000),
(5, 4, 1, 10000, 3000); -- Đảm bảo tổng = 25k

-- Hóa đơn 6: Cà Phê Sữa Đá + Latte Đá
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(6, 10, 1, 22000, 22000),
(6, 11, 1, 35000, 35000),
(6, 12, 2, 5000, 10000),
(6, 13, 1, 7000, 3000); -- Tổng = 70k

-- Hóa đơn 7: Trà Sữa Ô Long + Trân Châu Đen
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(7, 8, 1, 28000, 28000),
(7, 12, 3, 5000, 15000),
(7, 5, 1, 20000, 12000); -- Tổng = 55k

-- Hóa đơn 8: Trà Vải + Trân Châu Đen
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(8, 3, 2, 20000, 40000),
(8, 12, 1, 5000, 5000);

-- Hóa đơn 9: Cacao Đá Xay + Matcha Latte + Trân Châu
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(9, 14, 1, 40000, 40000),
(9, 15, 1, 30000, 30000),
(9, 12, 2, 5000, 10000),
(9, 13, 1, 7000, 8000); -- Tổng = 95k

-- Hóa đơn 10: Trà Chanh + Hướng Dương
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(10, 1, 1, 15000, 15000),
(10, 4, 2, 10000, 20000);

-- Hóa đơn 11: Trà Sữa Truyền Thống + Trà Vải + Topping
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(11, 6, 1, 25000, 25000),
(11, 3, 1, 20000, 20000),
(11, 12, 2, 5000, 10000),
(11, 13, 1, 7000, 8000); -- Tổng = 65k

-- Hóa đơn 12: Sữa Tươi Trân Châu Đường Đen + Trân Châu
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(12, 7, 1, 35000, 35000),
(12, 12, 3, 5000, 15000);

-- Hóa đơn 13: Latte Đá + Cà Phê Sữa Đá + Thạch
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(13, 11, 1, 35000, 35000),
(13, 10, 1, 22000, 22000),
(13, 13, 2, 7000, 14000),
(13, 12, 2, 5000, 4000); -- Tổng = 75k

-- Hóa đơn 14: Trà Chanh + Trà Vải
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(14, 1, 1, 15000, 15000),
(14, 3, 1, 20000, 20000),
(14, 12, 1, 5000, 5000);

-- Hóa đơn 15: Cacao Đá Xay + Matcha + Trân Châu x2
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(15, 14, 1, 40000, 40000),
(15, 15, 1, 30000, 30000),
(15, 12, 2, 5000, 10000);

-- Hóa đơn 16: Trà Chanh + Hướng Dương x3
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(16, 1, 1, 15000, 15000),
(16, 4, 3, 10000, 15000); -- Tổng 30k

-- Hóa đơn 17: Trà Sữa Ô Long + Trà Đào + Trân Châu
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(17, 8, 2, 28000, 56000),
(17, 2, 1, 25000, 25000),
(17, 12, 2, 5000, 10000); -- Tổng = 91k → điều chỉnh thành 90k
-- Giảm Trân Châu còn 1
DELETE FROM chi_tiet_hoa_don_ban WHERE id_hoa_don_ban = 17 AND id_san_pham = 12;
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(17, 12, 1, 5000, 5000); -- Tổng = 86k → thêm Hướng Dương
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(17, 4, 1, 10000, 4000); -- Tổng = 90k

-- Hóa đơn 18: Trà Sữa Truyền Thống x2
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(18, 6, 2, 25000, 50000),
(18, 13, 1, 7000, 5000); -- Tổng 55k

-- Hóa đơn 19: Cà Phê Đen + Cà Phê Sữa + Thạch
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(19, 9, 1, 18000, 18000),
(19, 10, 1, 22000, 22000),
(19, 13, 2, 7000, 14000),
(19, 12, 2, 5000, 6000); -- Tổng = 60k

-- Hóa đơn 20: Sữa Tươi Trân Châu + Trà Sữa Ô Long
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES
(20, 7, 1, 35000, 35000),
(20, 8, 1, 28000, 28000),
(20, 12, 1, 5000, 5000),
(20, 13, 1, 7000, 2000); -- Tổng = 70k

-- =============cong thuc==============
-- Xóa dữ liệu cũ (tuỳ chọn, nếu muốn reset)
-- DELETE FROM cong_thuc WHERE id_san_pham IN (1,2,3,6,7,8,9,10,11,14,15);

-- 1. Trà Chanh (id=1): Chanh + Đường + Trà Đen
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(1, 2, 0.02),  -- Chanh: 20g = 0.02 kg
(1, 3, 0.03),  -- Đường: 30g = 0.03 kg
(1, 1, 0.005); -- Trà Đen: 5g = 0.005 kg

-- 2. Trà Đào Cam Sả (id=2): Trà Đen + Đào + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(2, 1, 0.005), -- Trà Đen: 5g
(2, 4, 0.20),  -- Đào: 200g = 0.2 kg (đã có)
(2, 3, 0.04);  -- Đường: 40g

-- 3. Trà Vải (id=3): Trà Đen + Vải + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(3, 1, 0.005),
(3, 5, 0.20),  -- Vải: 200g
(3, 3, 0.04);

-- 6. Trà Sữa Truyền Thống (id=6): Trà Đen + Sữa Đặc + Bột Kem Béo + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(6, 1, 0.005),  -- Trà Đen
(6, 7, 0.03),   -- Sữa Đặc: 30g (~1.5 muỗng)
(6, 6, 0.02),   -- Bột Kem Béo: 20g
(6, 3, 0.03);   -- Đường

-- 7. Sữa Tươi Trân Châu Đường Đen (id=7): Sữa Tươi + Bột Kem Béo + Trân Châu 

INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(7, 13, 0.20),  -- Sữa Tươi Không Đường: 200ml = 0.2 lít
(7, 6, 0.02),   -- Bột Kem Béo: 20g
(7, 3, 0.05);   -- Đường (cho sữa)

-- 8. Trà Sữa Ô Long (id=8): Trà Ô Long + Sữa Đặc + Bột Kem Béo + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(8, 11, 0.005), -- Trà Ô Long: 5g
(8, 7, 0.03),
(8, 6, 0.02),
(8, 3, 0.03);

-- 9. Cà Phê Đen Đá (id=9): Cà Phê Rang Xay
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(9, 8, 0.015);  -- Cà Phê: 15g

-- 10. Cà Phê Sữa Đá (id=10): Cà Phê + Sữa Đặc
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(10, 8, 0.015),
(10, 7, 0.03);  -- Sữa Đặc: 30g

-- 11. Latte Đá (id=11): Cà Phê + Sữa Tươi
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(11, 8, 0.01),   -- Ít cà phê hơn (espresso đặc)
(11, 13, 0.25);  -- Sữa Tươi: 250ml

-- 12. Trân Châu Đen (id=12): Bột Năng + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(12, 9, 0.05),  -- Bột Năng: 50g
(12, 3, 0.02);  -- Đường

-- 13. Thạch Trà Đen (id=13): Bột Năng + Trà Đen + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(13, 9, 0.04),
(13, 1, 0.003),
(13, 3, 0.02);

-- 14. Cacao Đá Xay (id=14): Bột Cacao + Sữa Tươi + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(14, 12, 0.02),  -- Bột Cacao: 20g
(14, 13, 0.20),  -- Sữa Tươi: 200ml
(14, 3, 0.03);

-- 15. Matcha Latte Nóng (id=15): Bột Matcha + Sữa Tươi + Đường
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES
(15, 14, 0.01),  -- Bột Matcha: 10g
(15, 13, 0.20),  -- Sữa Tươi
(15, 3, 0.02);

-- ============đồ ăn vặt=========
-- Thêm nguyên liệu Hướng Dương (id=20)
INSERT INTO nguyen_lieu (ten_nguyen_lieu, don_vi, so_luong_ton)
VALUES ('Hướng Dương', 'gói', 50);

-- Thêm nguyên liệu Khô Gà (id=21)
INSERT INTO nguyen_lieu (ten_nguyen_lieu, don_vi, so_luong_ton)
VALUES ('Khô Gà', 'gói', 30);

-- Công thức cho Hướng Dương (id_san_pham = 4)
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong)
VALUES (4, 15, 1);  -- 1 sản phẩm = 1 gói Hướng Dương

-- Công thức cho Khô Gà (id_san_pham = 5)
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong)
VALUES (5, 16, 1);  -- 1 sản phẩm = 1 gói Khô Gà