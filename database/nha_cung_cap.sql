use tiemtrachanh1997;
-- Nhà cung cấp
-- Mục đích: Quản lý nhà cung cấp.

-- API cần thiết:

-- POST /api/ncc/create: Tạo ncc mới.

DELIMITER $$

CREATE PROCEDURE CreateNCC(
    IN p_ten_ncc VARCHAR(100),
    IN p_dia_chi VARCHAR(200),
    IN p_so_dien_thoai VARCHAR(20)
)
BEGIN
    INSERT INTO nha_cung_cap (ten_ncc, dia_chi, so_dien_thoai)
    VALUES (p_ten_ncc, p_dia_chi, p_so_dien_thoai);
END$$

DELIMITER ;

-- PUT /api/ncc/update/:id: Cập nhật thông tin ncc .

DELIMITER $$

CREATE PROCEDURE UpdateNCC(
    IN p_id INT,
    IN p_ten_ncc VARCHAR(100),
    IN p_dia_chi VARCHAR(200),
    IN p_so_dien_thoai VARCHAR(20)
)
BEGIN
    UPDATE nha_cung_cap
    SET
        ten_ncc = p_ten_ncc,
        dia_chi = p_dia_chi,
        so_dien_thoai = p_so_dien_thoai
    WHERE id = p_id;
END$$

DELIMITER ;

-- DELETE /api/ncc/delete/:id: Xóa ncc.

DELIMITER $$

CREATE PROCEDURE DeleteNCC(
    IN p_id INT
)
BEGIN
    DELETE FROM nha_cung_cap WHERE id = p_id;
END$$

DELIMITER ;

-- GET /api/ncc/get-all: Lấy danh sách tất cả ncc.

DELIMITER $$

CREATE PROCEDURE GetAllNCC()
BEGIN
    SELECT * FROM nha_cung_cap;
END$$

DELIMITER ;

-- GET /api/ncc/get-by-id/:id: Lấy thông tin ncc theo ID.

DELIMITER $$

CREATE PROCEDURE GetNCCByID(
    IN p_id INT
)
BEGIN
    SELECT * FROM nha_cung_cap WHERE id = p_id;
END$$

DELIMITER ;

-- GET /api/ncc/search: Tìm kiếm nhà cung cấp

DELIMITER $$

CREATE PROCEDURE SearchNCC(
    IN p_keyword VARCHAR(255)
)
BEGIN
    SELECT * FROM nha_cung_cap
    WHERE 
        ten_ncc LIKE CONCAT('%', p_keyword, '%')
        OR dia_chi LIKE CONCAT('%', p_keyword, '%')
        OR so_dien_thoai LIKE CONCAT('%', p_keyword, '%');
END$$

DELIMITER ;

-- lấy thông tin NCC + nguyên liệu
call GetNguyenLieuByNCCID(1);

DELIMITER $$
CREATE PROCEDURE GetNguyenLieuByNCCID(
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
        cthdn.thanh_tien,
        nl.don_vi,
        SUM(cthdn.so_luong) AS tong_so_luong_nhap,
        SUM(cthdn.thanh_tien) AS tong_tien_nhap
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
	GROUP BY
        ncc.id,
        ncc.ten_ncc,
        ncc.dia_chi,
        ncc.so_dien_thoai,
        nl.id,
        nl.ten_nguyen_lieu,
        nl.don_vi  -- 
    ORDER BY
        ncc.id, nl.ten_nguyen_lieu;
END$$
DELIMITER ;

-- lấy all NCC + nguyên liệu
call GetAllNguyenLieuByNCC();
DELIMITER $$

CREATE PROCEDURE GetAllNguyenLieuByNCC()
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
