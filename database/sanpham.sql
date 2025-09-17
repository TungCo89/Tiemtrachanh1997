SELECT * FROM tiemtrachanh1997.san_pham;
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