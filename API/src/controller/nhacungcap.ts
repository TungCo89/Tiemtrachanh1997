import { Request, Response } from "express";
import NCCModal from "../modal/nhacungcap";

export class NCCController {
  private nccModal: NCCModal;

  constructor(nccModal: NCCModal) {
    this.nccModal = nccModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.nccModal.getAll();
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
      const result = await this.nccModal.getByID(Number(id));
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

  async createNCC(req: Request, res: Response): Promise<void> {
    try {
      const { ten_ncc, dia_chi, so_dien_thoai } = req.body;

      await this.nccModal.createNCC(ten_ncc, dia_chi, so_dien_thoai);

      res.status(201).json({
        success: true,
        message: "Thêm thành công",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async updateNCC(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const nccId = Number(id);
      const { ten_ncc, dia_chi, so_dien_thoai } = req.body;

      if (isNaN(nccId)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }

      await this.nccModal.updateNCC(nccId, ten_ncc, dia_chi, so_dien_thoai);

      res.status(200).json({
        success: true,
        message: "Cập nhật thành công.",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async deleteNCC(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const nccId = Number(id);

      if (isNaN(nccId)) {
        res.status(400).json({ message: "ID không hợp lệ" });
        return;
      }

      await this.nccModal.deleteNCC(nccId);
      res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async searchNCCByKeyword(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        res.status(400).json({ message: "Từ khóa không được để trống" });
        return;
      }
      const result = await this.nccModal.searchNCCByKeyword(keyword as string);
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

export default NCCController;
