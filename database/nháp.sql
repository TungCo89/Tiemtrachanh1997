-- Thêm dữ liệu ban đầu cho các bảng chính trước
INSERT INTO loai_san_pham (ten_loai) VALUES ('Đồ uống'), ('Đồ ăn vặt');
INSERT INTO nguyen_lieu (ten_nguyen_lieu, don_vi) VALUES ('Đường', 'kg'), ('Chanh', 'quả'), ('Đá', 'kg');
INSERT INTO san_pham (ten_san_pham, gia_ban, mo_ta, id_loai) VALUES ('Trà Chanh', 15000, 'Trà chanh truyền thống', 1);
INSERT INTO ban (ten_ban, trang_thai) VALUES ('Bàn 1', 'Trống');
INSERT INTO nha_cung_cap (ten_ncc) VALUES ('Công ty A');
INSERT INTO vai_tro (ten_vai_tro) VALUES ('Admin'), ('Nhân viên');
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, ho_ten, id_vai_tro) VALUES ('admin', '123', 'Quản trị', 1);
INSERT INTO hoa_don_nhap (id_ncc) VALUES (1);
INSERT INTO hoa_don_ban (id_ban) VALUES (1);
INSERT INTO chi_tiet_hoa_don_nhap (id_hoa_don_nhap, id_nguyen_lieu, so_luong, don_gia, thanh_tien) VALUES (1, 1, 10, 10000, 100000);
INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien) VALUES (1, 1, 1, 15000, 15000);
INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong) VALUES (1, 1, 0.5);

-- Bảng san_pham
ALTER TABLE san_pham DROP FOREIGN KEY san_pham_ibfk_1;
ALTER TABLE san_pham ADD CONSTRAINT fk_san_pham_loai FOREIGN KEY (id_loai) REFERENCES loai_san_pham(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Bảng hoa_don_nhap
ALTER TABLE hoa_don_nhap DROP FOREIGN KEY hoa_don_nhap_ibfk_1;
ALTER TABLE hoa_don_nhap ADD CONSTRAINT fk_hdn_ncc FOREIGN KEY (id_ncc) REFERENCES nha_cung_cap(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Bảng chi_tiet_hoa_don_nhap
ALTER TABLE chi_tiet_hoa_don_nhap DROP FOREIGN KEY chi_tiet_hoa_don_nhap_ibfk_1;
ALTER TABLE chi_tiet_hoa_don_nhap DROP FOREIGN KEY chi_tiet_hoa_don_nhap_ibfk_2;
ALTER TABLE chi_tiet_hoa_don_nhap ADD CONSTRAINT fk_cthdn_hdn FOREIGN KEY (id_hoa_don_nhap) REFERENCES hoa_don_nhap(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE chi_tiet_hoa_don_nhap ADD CONSTRAINT fk_cthdn_nl FOREIGN KEY (id_nguyen_lieu) REFERENCES nguyen_lieu(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Bảng hoa_don_ban
ALTER TABLE hoa_don_ban DROP FOREIGN KEY hoa_don_ban_ibfk_1;
ALTER TABLE hoa_don_ban ADD CONSTRAINT fk_hdb_ban FOREIGN KEY (id_ban) REFERENCES ban(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Bảng chi_tiet_hoa_don_ban
ALTER TABLE chi_tiet_hoa_don_ban DROP FOREIGN KEY chi_tiet_hoa_don_ban_ibfk_1;
ALTER TABLE chi_tiet_hoa_don_ban DROP FOREIGN KEY chi_tiet_hoa_don_ban_ibfk_2;
ALTER TABLE chi_tiet_hoa_don_ban ADD CONSTRAINT fk_cthdb_hdb FOREIGN KEY (id_hoa_don_ban) REFERENCES hoa_don_ban(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE chi_tiet_hoa_don_ban ADD CONSTRAINT fk_cthdb_sp FOREIGN KEY (id_san_pham) REFERENCES san_pham(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Bảng cong_thuc
ALTER TABLE cong_thuc DROP FOREIGN KEY cong_thuc_ibfk_1;
ALTER TABLE cong_thuc DROP FOREIGN KEY cong_thuc_ibfk_2;
ALTER TABLE cong_thuc ADD CONSTRAINT fk_ct_sp FOREIGN KEY (id_san_pham) REFERENCES san_pham(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE cong_thuc ADD CONSTRAINT fk_ct_nl FOREIGN KEY (id_nguyen_lieu) REFERENCES nguyen_lieu(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Bảng nguoi_dung
ALTER TABLE nguoi_dung DROP FOREIGN KEY nguoi_dung_ibfk_1;
ALTER TABLE nguoi_dung ADD CONSTRAINT fk_nd_vt FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id) ON UPDATE CASCADE ON DELETE CASCADE;