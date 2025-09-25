import { Request, Response } from "express";
import LoaiSanPhamModal from "../modal/loaisanpham";

export class LoaiSanPhamController {
  private loaisanphamModal: LoaiSanPhamModal;

  constructor(loaisanphamModal: LoaiSanPhamModal) {
    this.loaisanphamModal = loaisanphamModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.loaisanphamModal.getAll();
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
      const result = await this.loaisanphamModal.getByID(Number(id));
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

  async createLoaiSanPham(req: Request, res: Response): Promise<void> {
    try {
      const { ten_loai } = req.body;

      await this.loaisanphamModal.createLoaiSanPham(ten_loai);

      res.status(201).json({
        success: true,
        message: "Thêm thành công",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async updateLoaiSanPham(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const ID = Number(id);
      const { ten_loai } = req.body;

      if (isNaN(ID)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }

      await this.loaisanphamModal.updateLoaiSanPham(ID, ten_loai);

      res.status(200).json({
        success: true,
        message: "Cập nhật thành công.",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async deleteLoaiSanPham(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const ID = Number(id);

      if (isNaN(ID)) {
        res.status(400).json({ message: "ID không hợp lệ" });
        return;
      }

      await this.loaisanphamModal.deleteLoaiSanPham(ID);
      res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async searchLoaiSanPhamByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      if (!name) {
        res.status(400).json({ message: "Tên không được để trống" });
        return;
      }
      const result = await this.loaisanphamModal.searchLoaiSanPhamByName(
        name as string
      );
      res.status(200).json({
        success: true,
        message: "Tìm kiếm thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
}

export default LoaiSanPhamController;
