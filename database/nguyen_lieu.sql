SELECT * FROM tiemtrachanh1997.nguyen_lieu;
use tiemtrachanh1997;

DELIMITER $$
CREATE PROCEDURE GetAllNguyenLieu()
BEGIN
    SELECT
        id,
        ten_nguyen_lieu,
        don_vi.
        so_luong_ton
    FROM
        nguyen_lieu ;
END$$
DELIMITER ;

-- GetSPbyID
DELIMITER $$
CREATE PROCEDURE GetNguyenLieuByID(
    IN p_id INT
)
BEGIN
    SELECT
        id,
        ten_nguyen_lieu,
        don_vi,
        so_luong_ton
    FROM
        nguyen_lieu 
    WHERE
        id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllNguyenLieuByNCC`()
BEGIN
    SELECT
        ncc.id AS id_ncc,
        ncc.ten_ncc,
        ncc.dia_chi,
        ncc.so_dien_thoai,
        nl.id AS id_nguyen_lieu,
        nl.ten_nguyen_lieu,
        nl.don_vi,
        SUM(cthdn.so_luong) AS tong_so_luong_nhap,
        SUM(cthdn.thanh_tien) AS tong_tien_nhap
    FROM
        nha_cung_cap AS ncc
    LEFT JOIN
        hoa_don_nhap AS hdn ON ncc.id = hdn.id_ncc
    LEFT JOIN
        chi_tiet_hoa_don_nhap AS cthdn ON hdn.id = cthdn.id_hoa_don_nhap
    LEFT JOIN
        nguyen_lieu AS nl ON cthdn.id_nguyen_lieu = nl.id
    GROUP BY
        ncc.id, nl.id
    ORDER BY
        ncc.id, nl.ten_nguyen_lieu;
END$$
DELIMITER ;

-- các nguyên liệu của nhà cung cấp (id)
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetNguyenLieuByNCCID`(
    IN p_id_ncc INT
)
BEGIN
    SELECT
        nl.id AS id_nguyen_lieu,
        nl.ten_nguyen_lieu,
        nl.don_vi,
        hdn.ngay_nhap,
        cthdn.so_luong,
        cthdn.don_gia,
        cthdn.thanh_tien
    FROM
        nha_cung_cap AS ncc
    JOIN
        hoa_don_nhap AS hdn ON ncc.id = hdn.id_ncc
    JOIN
        chi_tiet_hoa_don_nhap AS cthdn ON hdn.id = cthdn.id_hoa_don_nhap
    JOIN
        nguyen_lieu AS nl ON cthdn.id_nguyen_lieu = nl.id
    WHERE
        ncc.id = p_id_ncc
    ORDER BY hdn.ngay_nhap DESC, nl.ten_nguyen_lieu; -- Thêm ORDER BY để dễ theo dõi
END$$
DELIMITER ;

-- lấy ra thông tin nhà cung cấp nguyên liệu(id nguyên liệu)
DELIMITER $$
CREATE PROCEDURE GetNCCByNguyenLieuID(
    IN p_id_nguyen_lieu INT
)
BEGIN
    SELECT DISTINCT
        ncc.id AS id_ncc,
        ncc.ten_ncc,
        ncc.dia_chi,
        ncc.so_dien_thoai
    FROM
        nha_cung_cap AS ncc
    JOIN
        hoa_don_nhap AS hdn ON ncc.id = hdn.id_ncc
    JOIN
        chi_tiet_hoa_don_nhap AS cthdn ON hdn.id = cthdn.id_hoa_don_nhap
    WHERE
        cthdn.id_nguyen_lieu = p_id_nguyen_lieu
    ORDER BY
        ncc.ten_ncc;
END$$

DELIMITER ;

-- create 
DELIMITER $$
CREATE PROCEDURE CreateNguyeLieu(
    IN p_ten_nguyen_lieu VARCHAR(100),
    IN p_don_vi VARCHAR(20)
)
BEGIN
    INSERT INTO nguyen_lieu (p_ten_nguyen_lieu,p_don_vi)
    VALUES (ten_nguyen_lieu,don_vi);
END$$
DELIMITER ;

-- update
DELIMITER $$
CREATE PROCEDURE UpdateNguyenLieu(
    IN p_id INT,
    IN p_ten_nguyen_lieu VARCHAR(100),
    IN p_don_vi VARCHAR(20),
    In p_so_luong_ton VARCHAR(20)
)
BEGIN
    UPDATE nguyen_lieu
    SET
		ten_nguyen_lieu = p_ten_nguyen_lieu,
        don_vi = p_don_vi,
        so_luong_ton = p_so_luong_ton
    WHERE
        id = p_id;
END$$
DELIMITER ;

-- delete
DELIMITER $$
CREATE PROCEDURE DeleteNguyenLieu(
    IN p_id INT
)
BEGIN
    DELETE FROM nguyen_lieu
    WHERE id = p_id;
END$$
DELIMITER ;

-- tìm kiếm theo tên

DELIMITER $$
CREATE PROCEDURE SearchNguyenLieu(
    IN p_ten_nguyen_lieu VARCHAR(100)
)
BEGIN
    SELECT
        id,
        ten_nguyen_lieu,
        don_vi
    FROM
        nguyen_lieu
    WHERE
        ten_nguyen_lieu LIKE CONCAT('%', p_ten_nguyen_lieu, '%');
END$$
DELIMITER ;

call SearchLoaiSanPhamByName("trà");

