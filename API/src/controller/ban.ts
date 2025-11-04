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

  async getBanByIDKhuVuc(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const result = await this.banModal.getBanByIDKhuVuc(Number(id));
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
      const { ten_ban, id_khu_vuc } = req.body;
      await this.banModal.createBan(ten_ban, id_khu_vuc);
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
      const { ten_ban, trang_thai, id_khu_vuc } = req.body;

      if (isNaN(ID)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }

      await this.banModal.updateBan(ID, ten_ban, trang_thai, id_khu_vuc);

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
  async donBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "ID bàn không hợp lệ",
        });
        return;
      }
      await this.banModal.donBan(Number(id));
      res.status(200).json({
        success: true,
        message: "Dọn bàn thành công",
      });
    } catch (error: any) {
      console.error("Lỗi khi dọn bàn:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ",
        error: error.message,
      });
    }
  }
  async thanhToan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "ID bàn không hợp lệ",
        });
        return;
      }
      await this.banModal.thanhToan(Number(id));
      res.status(200).json({
        success: true,
        message: "Thanh toán thành công",
      });
    } catch (error: any) {
      console.error("Lỗi khi thanh toán:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ",
        error: error.message,
      });
    }
  }
}

export default BanController;
