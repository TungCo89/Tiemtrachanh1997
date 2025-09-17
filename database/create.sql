create database LuyenThi912;
use LuyenThi912;

CREATE TABLE NguoiDung (
    IDNguoiDung BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Ten VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro INT NOT NULL, -- 1: Người học, 2: Giảng viên, 3: Admin
    TrangThai ENUM('HoatDong', 'KhongHoatDong') DEFAULT 'HoatDong',
    ThoiGianTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ThoiGianCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ThoiGianXacMinhEmail TIMESTAMP NULL,
    ThoiGianHetHan TIMESTAMP NULL,
    SoDienThoai VARCHAR(20) NULL,
    DiaChi VARCHAR(255) NULL,
    NgaySinh DATE NULL,
    GioiTinh VARCHAR(10) NULL,
    AnhDaiDien VARCHAR(255) NULL,
    ThongTinChiTiet TEXT NULL, 
    FOREIGN KEY (VaiTro) REFERENCES PhanQuyen(MaQuyen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE PhanQuyen (
    MaQuyen INT PRIMARY KEY,
    TenQuyen VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE GiaoVien (
    IDGiaoVien INT AUTO_INCREMENT PRIMARY KEY,
    IDNguoiDung BIGINT UNSIGNED NOT NULL,
    ThongTinChiTiet TEXT,
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DanhMuc (
    IDDanhMuc INT AUTO_INCREMENT PRIMARY KEY,
    TenDanhMuc VARCHAR(255) NOT NULL,
    MoTa TEXT,
    ThuTu INT,
    IDDanhMucCha INT,
    FOREIGN KEY (IDDanhMucCha) REFERENCES DanhMuc(IDDanhMuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE GiaoVien_DanhMuc (
    IDGiaoVien INT,
    IDDanhMuc INT,
    PRIMARY KEY (IDGiaoVien, IDDanhMuc),
    FOREIGN KEY (IDGiaoVien) REFERENCES GiaoVien(IDGiaoVien) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IDDanhMuc) REFERENCES DanhMuc(IDDanhMuc) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE KhoaHoc (
    IDKhoaHoc INT AUTO_INCREMENT PRIMARY KEY,
    IDDanhMuc INT,
    TieuDe VARCHAR(100) NOT NULL,
    MoTa TEXT,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    HocPhi DECIMAL(10,2),
    IDGiaoVien INT,
    TrangThai ENUM('HoatDong', 'KhongHoatDong') DEFAULT 'HoatDong',
    FOREIGN KEY (IDGiaoVien) REFERENCES GiaoVien(IDGiaoVien),
    FOREIGN KEY (IDDanhMuc) REFERENCES DanhMuc(IDDanhMuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE BaiHoc (
    IDBaiHoc INT AUTO_INCREMENT PRIMARY KEY,
    IDKhoaHoc INT,
    TieuDe VARCHAR(255) NOT NULL,
    NoiDung TEXT,
    TepDinhKem VARCHAR(255),
    ThuTu INT,
    FOREIGN KEY (IDKhoaHoc) REFERENCES KhoaHoc(IDKhoaHoc),
    UNIQUE (IDKhoaHoc, ThuTu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VideoBaiGiang (
    IDVideo INT AUTO_INCREMENT PRIMARY KEY,
    IDBaiHoc INT NOT NULL,
    TieuDe VARCHAR(255) NOT NULL,
    URLVideo VARCHAR(2048) NOT NULL,
    URLAnhDaiDien VARCHAR(2048) NULL,
    ThuTu INT NULL,
    FOREIGN KEY (IDBaiHoc) REFERENCES BaiHoc(IDBaiHoc) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE DonHang (
    IDDonHang BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    IDNguoiDung BIGINT UNSIGNED NOT NULL,
    TongTien DECIMAL(10,2) NOT NULL,
    DiaChiGiaoHang VARCHAR(255),
    PhuongThucThanhToan VARCHAR(50) NOT NULL,
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, completed, cancelled
    ThoiGianTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ThoiGianCapNhat TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    SoDienThoai VARCHAR(20),
    DiaChi VARCHAR(255),
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ChiTietDonHang (
    ID BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    IDDonHang BIGINT UNSIGNED NOT NULL,
    MaSP INT NOT NULL, -- Có thể là MaSach hoặc IDKhoaHoc
    LoaiSP ENUM('Sach', 'KhoaHoc') NOT NULL,
    TenSP VARCHAR(255) NOT NULL,
    SoLuong INT NOT NULL,
    ThanhTien DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (IDDonHang) REFERENCES DonHang(IDDonHang) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DangKyKhoaHoc (
    IDDangKy INT AUTO_INCREMENT PRIMARY KEY,
    IDNguoiDung BIGINT UNSIGNED,
    IDKhoaHoc INT,
    ThoiGianDangKy DATETIME DEFAULT CURRENT_TIMESTAMP,
    TrangThai VARCHAR(20) DEFAULT 'ChuaThanhToan',  -- Thêm trạng thái đăng ký
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung),
    FOREIGN KEY (IDKhoaHoc) REFERENCES KhoaHoc(IDKhoaHoc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE BaiKiemTra (
    IDBaiKiemTra INT AUTO_INCREMENT PRIMARY KEY,
    IDDanhMuc INT,  -- Liên kết với danh mục (ví dụ: lớp, môn học)
    TieuDe VARCHAR(255) NOT NULL,
    MoTa TEXT,
    ThoiGianLamBai INT,  -- Thời gian làm bài (phút)
    LoaiBaiKiemTra VARCHAR(50), -- Ví dụ: 'Trắc nghiệm', 
    TrangThai ENUM('HoatDong', 'KhongHoatDong') DEFAULT 'HoatDong',
    ThoiGianTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IDDanhMuc) REFERENCES DanhMuc(IDDanhMuc)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE CauHoi (
    IDCauHoi INT AUTO_INCREMENT PRIMARY KEY,
    IDBaiKiemTra INT,
    NoiDung TEXT NOT NULL,
    LoaiCauHoi VARCHAR(50), 
    DoKho ENUM('De', 'TrungBinh', 'Kho') DEFAULT 'TrungBinh',
    ThuTu INT,  -- Thứ tự câu hỏi trong bài kiểm tra
    Diem FLOAT,   -- Điểm cho câu hỏi
    FOREIGN KEY (IDBaiKiemTra) REFERENCES BaiKiemTra(IDBaiKiemTra)  ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (IDBaiKiemTra, ThuTu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DapAn (
    IDDapAn INT AUTO_INCREMENT PRIMARY KEY,
    IDCauHoi INT,
    NoiDung TEXT NOT NULL,
    LaDapAnDung BOOLEAN DEFAULT FALSE,  -- Đánh dấu đáp án đúng
    FOREIGN KEY (IDCauHoi) REFERENCES CauHoi(IDCauHoi) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE KetQuaThi (
    IDKetQua INT AUTO_INCREMENT PRIMARY KEY,
    IDNguoiDung BIGINT UNSIGNED,
    IDBaiKiemTra INT,
    ThoiGianBatDau TIMESTAMP,
    ThoiGianKetThuc TIMESTAMP,
    DiemSo FLOAT,
    TrangThai VARCHAR(20),  -- Ví dụ: 'Đã hoàn thành', 'Chưa hoàn thành', 'Đang làm'
    SoLanThi INT DEFAULT 1,
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IDBaiKiemTra) REFERENCES BaiKiemTra(IDBaiKiemTra)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ChiTietKetQua (
    IDChiTietKetQua INT AUTO_INCREMENT PRIMARY KEY,
    IDKetQua INT,
    IDCauHoi INT,
    IDDapAnDaChon INT,  -- Lưu ID đáp án mà người dùng đã chọn
    NoiDungTraLoi TEXT,  -- Lưu câu trả lời dạng tự luận
    DiemCauHoi FLOAT,
    FOREIGN KEY (IDKetQua) REFERENCES KetQuaThi(IDKetQua)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IDCauHoi) REFERENCES CauHoi(IDCauHoi)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IDDapAnDaChon) REFERENCES DapAn(IDDapAn)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DanhGia (
    IDDanhGia INT AUTO_INCREMENT PRIMARY KEY,
    IDNguoiDung BIGINT UNSIGNED,
    IDKhoaHoc INT,
    IDGiaoVien INT,
    NoiDungDanhGia TEXT NOT NULL,
    DiemDanhGia INT,  -- Ví dụ: từ 1 đến 5 sao
    ThoiGianDanhGia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IDNguoiDung) REFERENCES NguoiDung(IDNguoiDung),
    FOREIGN KEY (IDKhoaHoc) REFERENCES KhoaHoc(IDKhoaHoc),
    FOREIGN KEY (IDGiaoVien) REFERENCES GiaoVien(IDGiaoVien)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
