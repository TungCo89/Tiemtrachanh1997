import { Request, Response } from "express";
import NguyenLieuModal from "../modal/nguyenlieu";

export class NguyenLieuController {
  private nguyenlieuModal: NguyenLieuModal;

  constructor(nguyenlieuModal: NguyenLieuModal) {
    this.nguyenlieuModal = nguyenlieuModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.nguyenlieuModal.getAll();
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
      const result = await this.nguyenlieuModal.getByID(Number(id));
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

  
  async getByIDNCC(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const result = await this.nguyenlieuModal.getByIDNCC(Number(id));
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

  async createNguyenLieu(req: Request, res: Response): Promise<void> {
    try {
      const {ten_nguyen_lieu, don_vi } = req.body;

      await this.nguyenlieuModal.createNguyenLieu(
        ten_nguyen_lieu,
        don_vi
      );

      res.status(201).json({
        success: true,
        message: "Thêm nguyên liệu thành công",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async updateNguyenLieu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const ID = Number(id);
      const { ten_nguyen_lieu, don_vi } = req.body;

      if (isNaN(ID)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }

      await this.nguyenlieuModal.updateNguyenLieu(
        ID,
        ten_nguyen_lieu,
        don_vi
      );

      res
        .status(200)
        .json({
          success: true,
          message: "Cập nhật nguyên liệu.",
        });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async deleteNguyenLieu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const ID = Number(id);

      if (isNaN(ID)) {
        res.status(400).json({ message: "ID nguyên liệu không hợp lệ" });
        return;
      }

      await this.nguyenlieuModal.deleteNguyenLieu(ID);
      res
        .status(200)
        .json({ success: true, message: "Xóa nguyên liệu thành công" });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async searchNguyenLieuByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      if (!name) {
        res.status(400).json({ message: "Tên nguyên liệu không được để trống" });
        return;
      }
      const result = await this.nguyenlieuModal.searchNguyenLieuByName(
        name as string
      );
      res.status(200).json({
        success: true,
        message: "Tìm kiếm nguyên liệu thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
}

export default NguyenLieuController;
