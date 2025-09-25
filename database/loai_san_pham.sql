SELECT * FROM tiemtrachanh1997.loai_san_pham;
use tiemtrachanh1997;

DELIMITER $$
CREATE PROCEDURE GetAllLoaiSanPham()
BEGIN
    SELECT
        id,
        ten_loai
    FROM
        loai_san_pham ;
END$$
DELIMITER ;

-- GetSPbyID
DELIMITER $$
CREATE PROCEDURE GetLoaiSanPhamByID(
    IN p_id_loai_san_pham INT
)
BEGIN
    SELECT
        id,
        ten_loai
    FROM
        loai_san_pham
    WHERE
        id = p_id_loai_san_pham;
END$$
DELIMITER ;

-- create 
DELIMITER $$
CREATE PROCEDURE CreateLoaiSanPham(
    IN p_ten_loai VARCHAR(100)
)
BEGIN
    INSERT INTO loai_san_pham (ten_loai)
    VALUES (p_ten_loai);
END$$
DELIMITER ;

-- update
DELIMITER $$
CREATE PROCEDURE UpdateLoaiSanPham(
    IN p_id INT,
    IN p_ten_loai VARCHAR(100)
)
BEGIN
    UPDATE loai_san_pham
    SET
        ten_loai = p_ten_loai
    WHERE
        id = p_id;
END$$
DELIMITER ;

-- delete
DELIMITER $$
CREATE PROCEDURE DeleteLoaiSanPham(
    IN p_id INT
)
BEGIN
    DELETE FROM loai_san_pham
    WHERE id = p_id;
END$$
DELIMITER ;

-- tìm kiếm theo tên

DELIMITER $$
CREATE PROCEDURE SearchLoaiSanPhamByName(
    IN p_ten_loai VARCHAR(100)
)
BEGIN
    SELECT
        id,
        ten_loai
    FROM
        loai_san_pham
    WHERE
        ten_loai LIKE CONCAT('%', p_ten_loai, '%');
END$$
DELIMITER ;

call SearchLoaiSanPhamByName("trà");

