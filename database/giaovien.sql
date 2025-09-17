SELECT * FROM luyenthi912.giaovien;


DELIMITER //

CREATE PROCEDURE GetAllGiaoVien()
BEGIN
    SELECT
        ND.IDNguoiDung,
        ND.Ten,
        ND.Email,
        ND.SoDienThoai,
        ND.DiaChi,
        ND.NgaySinh,
        ND.GioiTinh,
        ND.AnhDaiDien,
        GV.IDGiaoVien,
        GV.ThongTinChiTiet AS ThongTinGiaoVien,
        GROUP_CONCAT(DISTINCT DM.TenDanhMuc SEPARATOR ', ') AS DanhMucGiangDay,
        GROUP_CONCAT(DISTINCT CONCAT(KH.TieuDe, ' (ID: ', KH.IDKhoaHoc, ', Học phí: ', KH.HocPhi, ')') SEPARATOR '; ') AS KhoaHocDangDay
    FROM
        NguoiDung AS ND
    INNER JOIN
        GiaoVien AS GV ON ND.IDNguoiDung = GV.IDNguoiDung
    LEFT JOIN
        GiaoVien_DanhMuc AS GVDM ON GV.IDGiaoVien = GVDM.IDGiaoVien
    LEFT JOIN
        DanhMuc AS DM ON GVDM.IDDanhMuc = DM.IDDanhMuc
    LEFT JOIN
        KhoaHoc AS KH ON GV.IDGiaoVien = KH.IDGiaoVien
    WHERE
        ND.VaiTro = 2 -- Giả sử VaiTro = 2 là 'Giảng viên' dựa trên chú thích của bạn
    GROUP BY
        ND.IDNguoiDung, ND.Ten, ND.Email, ND.SoDienThoai, ND.DiaChi, ND.NgaySinh, ND.GioiTinh, ND.AnhDaiDien, GV.IDGiaoVien, GV.ThongTinChiTiet
    ORDER BY
        ND.Ten;
END //

DELIMITER ;


