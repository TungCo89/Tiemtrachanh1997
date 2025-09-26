import { Request, Response } from "express";
import HDBanModal from "../modal/hoadonban";

export class HDBanController {
  private hdbanModal: HDBanModal;

  constructor(hdbanModal: HDBanModal) {
    this.hdbanModal = hdbanModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.hdbanModal.getAll();
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
      const result = await this.hdbanModal.getByID(Number(id));
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

  async createHDBan(req: Request, res: Response): Promise<void> {
    try {
      const { chi_tiet } = req.body;

      await this.hdbanModal.createHDBan(chi_tiet);

      res.status(201).json({
        success: true,
        message: "Thêm thành công",
      });
    } catch (error: any) {
      console.error("Lỗi khi tạo HD bán:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async updateHDBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const hdbanId = Number(id);
      const { chi_tiet } = req.body;

      if (isNaN(hdbanId)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }

      await this.hdbanModal.updateHDBan(hdbanId, chi_tiet);

      res.status(200).json({
        success: true,
        message: "Cập nhật thành công.",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async deleteHDBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const hdbanId = Number(id);

      if (isNaN(hdbanId)) {
        res.status(400).json({ message: "ID  không hợp lệ" });
        return;
      }

      await this.hdbanModal.deleteHDBan(hdbanId);
      res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  // async searchHDBanByName(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { name } = req.query;
  //     if (!name) {
  //       res.status(400).json({ message: "Tên không được để trống" });
  //       return;
  //     }
  //     const result = await this.hdbanModal.searchHDBanByName(
  //       name as string
  //     );
  //     res.status(200).json({
  //       success: true,
  //       message: "Tìm kiếm thành công",
  //       data: result,
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  //   }
  // }
}

export default HDBanController;
