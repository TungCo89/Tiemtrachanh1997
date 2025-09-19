import { Request, Response } from "express";
import SanPhamModal from "../modal/sanpham";

export class SanPhamController {
  private sanphamModal: SanPhamModal;

  constructor(sanphamModal: SanPhamModal) {
    this.sanphamModal = sanphamModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.sanphamModal.getAll();
      res.status(200).json({
        success: true,
        message: "Lấy thông tin thành công",
        data: result,
      });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async getByID(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const result = await this.sanphamModal.getByID(Number(id));
      res.status(200).json({
        success: true,
        message: "Lấy thông tin thành công",
        data: result,
      });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async createSanPham(req: Request, res: Response): Promise<void> {
    try {
      const { ten_san_pham, gia_ban, mo_ta, id_loai, cong_thuc } = req.body;

      await this.sanphamModal.createSanPham(
        ten_san_pham,
        gia_ban,
        mo_ta,
        id_loai,
        cong_thuc
      );

      res.status(201).json({
        success: true,
        message: "Thêm sản phẩm và công thức thành công",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async updateSanPham(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const sanphamId = Number(id);
      const { ten_san_pham, gia_ban, mo_ta, id_loai, cong_thuc } = req.body;

      if (isNaN(sanphamId)) {
        res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
        return;
      }

      await this.sanphamModal.updateSanPham(
        sanphamId,
        ten_san_pham,
        gia_ban,
        mo_ta,
        id_loai,
        cong_thuc
      );

      res
        .status(200)
        .json({
          success: true,
          message: "Cập nhật sản phẩm và công thức thành công.",
        });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async deleteSanPham(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const sanphamId = Number(id);

      if (isNaN(sanphamId)) {
        res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
        return;
      }

      await this.sanphamModal.deleteSanPham(sanphamId);
      res
        .status(200)
        .json({ success: true, message: "Xóa sản phẩm thành công" });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async searchSanPhamByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      if (!name) {
        res.status(400).json({ message: "Tên sản phẩm không được để trống" });
        return;
      }
      const result = await this.sanphamModal.searchSanPhamByName(
        name as string
      );
      res.status(200).json({
        success: true,
        message: "Tìm kiếm sản phẩm thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
}

export default SanPhamController;
