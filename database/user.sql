SELECT * FROM luyenthi912.nguoidung;
use luyenthi912;
DELIMITER $$

CREATE PROCEDURE GetAllNguoiDung()
BEGIN
    SELECT
        nd.IDNguoiDung,
        nd.Ten,
        nd.Email,
        nd.MatKhau,
        nd.VaiTro,
        pq.TenQuyen AS TenVaiTro, 
        nd.TrangThai,
        nd.ThoiGianTao,
        nd.ThoiGianCapNhat,
        nd.ThoiGianXacMinhEmail,
        nd.ThoiGianHetHan,
        nd.SoDienThoai,
        nd.DiaChi,
        nd.NgaySinh,
        nd.GioiTinh,
        nd.AnhDaiDien,
        nd.ThongTinChiTiet
    FROM
        NguoiDung AS nd
    JOIN
        PhanQuyen AS pq ON nd.VaiTro = pq.MaQuyen;
END$$

DELIMITER ;