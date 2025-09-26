import { Request, Response } from "express";
import BanModal from "../modal/ban";

export class BanController {
  private banModal: BanModal;

  constructor(banModal: BanModal) {
    this.banModal = banModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.banModal.getAll();
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
      const result = await this.banModal.getByID(Number(id));
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

  async createBan(req: Request, res: Response): Promise<void> {
    try {
      const { ten_ban } = req.body;
      await this.banModal.createBan(ten_ban);
      res.status(201).json({
        success: true,
        message: "Thêm thành công",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async updateBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const ID = Number(id);
      const { ten_ban, trang_thai } = req.body;

      if (isNaN(ID)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }

      await this.banModal.updateBan(ID, ten_ban, trang_thai);

      res.status(200).json({
        success: true,
        message: "Cập nhật thành công.",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async deleteBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const ID = Number(id);

      if (isNaN(ID)) {
        res.status(400).json({ message: "ID không hợp lệ" });
        return;
      }

      await this.banModal.deleteBan(ID);
      res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  // async searchBanByName(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { name } = req.query;
  //     if (!name) {
  //       res.status(400).json({ message: "Tên không được để trống" });
  //       return;
  //     }
  //     const result = await this.banModal.searchBanByName(name as string);
  //     res.status(200).json({
  //       success: true,
  //       message: "Tìm kiếm  thành công",
  //       data: result,
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  //   }
  // }
}

export default BanController;
