SELECT * FROM tiemtrachanh1997.san_pham;
SELECT * FROM tiemtrachanh1997.cong_thuc;
use tiemtrachanh1997;

-- Sản Phẩm và Công Thức
-- Mục đích: Quản lý thông tin sản phẩm và công thức liên quan.

-- API cần thiết:

-- POST /api/sanpham/create: Thêm sản phẩm và công thức.

-- PUT /api/sanpham/update/:id: Cập nhật sản phẩm và công thức.

-- DELETE /api/sanpham/delete/:id: Xóa sản phẩm và công thức.

-- GET /api/sanpham/get-all: Lấy danh sách tất cả sản phẩm.

-- GET /api/sanpham/get-by-id/:id: Lấy thông tin sản phẩm và công thức theo ID.

-- GET /api/sanpham/search: Tìm kiếm sản phẩm theo tên.

-- Procedure:

-- CreateSanPhamVaCongThuc

-- UpdateSanPhamVaCongThuc

-- DeleteSanPhamVaCongThuc

-- GetAllSanPham (Có thể sử dụng JOIN để lấy thêm thông tin loại SP).

-- GetSanPhamVaCongThucByID (Cần kết hợp san_pham và cong_thuc).

-- SearchSanPham.

DELIMITER $$
CREATE PROCEDURE GetAllSanPham()
BEGIN
    SELECT
        sp.id,
        sp.ten_san_pham,
        sp.gia_ban,
        sp.mo_ta,
        lsp.ten_loai
    FROM
        san_pham sp
    JOIN
        loai_san_pham lsp ON sp.id_loai = lsp.id;
END$$

DELIMITER ;

-- GetSPbyID
DELIMITER $$

CREATE PROCEDURE GetSanPhamByID(
    IN p_id_san_pham INT
)
BEGIN
    SELECT
        sp.id,
        sp.ten_san_pham,
        sp.gia_ban,
        sp.mo_ta,
        lsp.ten_loai
    FROM
        san_pham sp
    JOIN
        loai_san_pham lsp ON sp.id_loai = lsp.id
    WHERE
        sp.id = p_id_san_pham;
END$$

DELIMITER ;

-- GetAllSanPhamVaCongThuc

DELIMITER $$

CREATE PROCEDURE GetAllSanPhamVaCongThuc()
BEGIN
    SELECT
        sp.id,
        sp.ten_san_pham,
        sp.gia_ban,
        sp.mo_ta,
        lsp.ten_loai,
        ct.id_nguyen_lieu,
        ct.so_luong,
        nl.ten_nguyen_lieu,
        nl.don_vi
    FROM
        san_pham sp
    JOIN
        loai_san_pham lsp ON sp.id_loai = lsp.id
    LEFT JOIN
        cong_thuc ct ON sp.id = ct.id_san_pham
    LEFT JOIN
        nguyen_lieu nl ON ct.id_nguyen_lieu = nl.id;
END$$

DELIMITER ;

-- GetSanPhamVaCongThucByID
DELIMITER $$

CREATE PROCEDURE GetSanPhamVaCongThucByID(
    IN p_id_san_pham INT
)
BEGIN
    SELECT
        sp.id,
        sp.ten_san_pham,
        sp.gia_ban,
        sp.mo_ta,
        lsp.ten_loai,
        ct.id_nguyen_lieu,
        ct.so_luong,
        nl.ten_nguyen_lieu,
        nl.don_vi
    FROM
        san_pham sp
    JOIN
        loai_san_pham lsp ON sp.id_loai = lsp.id
    LEFT JOIN
        cong_thuc ct ON sp.id = ct.id_san_pham
    LEFT JOIN
        nguyen_lieu nl ON ct.id_nguyen_lieu = nl.id
    WHERE
        sp.id = p_id_san_pham;
END$$

DELIMITER ;

-- create
DELIMITER $$

CREATE PROCEDURE ThemSanPhamVaCongThuc(
    IN p_ten_san_pham VARCHAR(100),
    IN p_gia_ban DECIMAL(15,2),
    IN p_mo_ta TEXT,
    IN p_id_loai INT,
    IN p_nguyen_lieu_json TEXT
)
BEGIN
    DECLARE v_id_san_pham INT;

    -- Thêm sản phẩm mới vào bảng san_pham
    INSERT INTO san_pham (ten_san_pham, gia_ban, mo_ta, id_loai)
    VALUES (p_ten_san_pham, p_gia_ban, p_mo_ta, p_id_loai);

    -- Lấy ID của sản phẩm vừa được thêm
    SET v_id_san_pham = LAST_INSERT_ID();

    -- Chèn công thức từ JSON
    INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong)
    SELECT
        v_id_san_pham,
        JSON_UNQUOTE(JSON_EXTRACT(p_nguyen_lieu_json, CONCAT('$[', i, '].id_nguyen_lieu'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_nguyen_lieu_json, CONCAT('$[', i, '].so_luong')))
    FROM
        (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
    WHERE
        JSON_EXTRACT(p_nguyen_lieu_json, CONCAT('$[', i, '].id_nguyen_lieu')) IS NOT NULL;
END$$

DELIMITER ;

-- update
DELIMITER $$
CREATE PROCEDURE UpdateSanPhamVaCongThuc(
    IN p_id INT,
    IN p_ten_san_pham VARCHAR(100),
    IN p_gia_ban DECIMAL(15,2),
    IN p_mo_ta TEXT,
    IN p_id_loai INT,
    IN p_cong_thuc_json TEXT
)
BEGIN
    -- Bước 1: Cập nhật thông tin cơ bản của sản phẩm
    UPDATE san_pham
    SET
        ten_san_pham = p_ten_san_pham,
        gia_ban = p_gia_ban,
        mo_ta = p_mo_ta,
        id_loai = p_id_loai
    WHERE
        id = p_id;

    -- Bước 2: Xóa công thức cũ và chèn công thức mới
    -- Cách đơn giản và an toàn nhất là xóa tất cả và chèn lại.
    DELETE FROM cong_thuc WHERE id_san_pham = p_id;

    -- Chèn công thức mới từ JSON
    INSERT INTO cong_thuc (id_san_pham, id_nguyen_lieu, so_luong)
    SELECT
        p_id,
        JSON_UNQUOTE(JSON_EXTRACT(p_cong_thuc_json, CONCAT('$[', i, '].id_nguyen_lieu'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_cong_thuc_json, CONCAT('$[', i, '].so_luong')))
    FROM
        (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
    WHERE
        JSON_EXTRACT(p_cong_thuc_json, CONCAT('$[', i, '].id_nguyen_lieu')) IS NOT NULL;
END$$
DELIMITER ;

-- delete
DELIMITER $$
CREATE PROCEDURE DeleteSanPham(
    IN p_id INT
)
BEGIN
    DELETE FROM san_pham
    WHERE id = p_id;
END$$
DELIMITER ;

-- tìm kiếm theo tên

DELIMITER $$
CREATE PROCEDURE SearchSanPhamByName(
    IN p_ten_san_pham VARCHAR(100)
)
BEGIN
    SELECT
        sp.id,
        sp.ten_san_pham,
        sp.gia_ban,
        sp.mo_ta,
        lsp.ten_loai
    FROM
        san_pham sp
    JOIN
        loai_san_pham lsp ON sp.id_loai = lsp.id
    WHERE
        sp.ten_san_pham LIKE CONCAT('%', p_ten_san_pham, '%');
END$$
DELIMITER ;

call SearchSanPhamByName("trà");

