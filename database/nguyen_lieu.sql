SELECT * FROM tiemtrachanh1997.nguyen_lieu;
use tiemtrachanh1997;

DELIMITER $$
CREATE PROCEDURE GetAllNguyenLieu()
BEGIN
    SELECT
        id,
        ten_nguyen_lieu,
        don_vi
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
        don_vi
    FROM
        nguyen_lieu 
    WHERE
        id = p_id;
END$$
DELIMITER ;

-- create 
DELIMITER $$
CREATE PROCEDURE ThemNguyeLieu(
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
    IN p_don_vi VARCHAR(20)
)
BEGIN
    UPDATE nguyen_lieu
    SET
		ten_nguyen_lieu = p_ten_nguyen_lieu,
        don_vi = p_don_vi
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

