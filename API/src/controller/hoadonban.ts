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
  async getByIDBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const result = await this.hdbanModal.getByIDBan(Number(id));
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
      const { id_ban, chi_tiet } = req.body;
      const chiTietHoanChinh = chi_tiet.map((item: any) => {
        const soLuong = parseFloat(item.so_luong);
        const donGia = parseFloat(item.don_gia);

        if (isNaN(soLuong) || isNaN(donGia) || soLuong <= 0) {
          throw new Error("Số lượng hoặc đơn giá của sản phẩm không hợp lệ.");
        }
        const thanhTien = soLuong * donGia;
        return {
          ...item,
          so_luong: soLuong,
          don_gia: donGia,
          thanh_tien: thanhTien,
        };
      });

      await this.hdbanModal.createHDBan(id_ban, chiTietHoanChinh);
      res.status(201).json({
        success: true,
        message: "Tạo hóa đơn bán thành công.",
      });
    } catch (error: any) {
      console.error("Lỗi khi tạo HD bán:", error);
      const statusCode = error.message.includes("không hợp lệ") ? 400 : 500;
      res
        .status(statusCode)
        .json({ success: false, message: "Lỗi máy chủ", error: error.message });
    }
  }

  async updateHDBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const hdbanId = Number(id);
      const { chi_tiet } = req.body;

      const chiTietHoanChinh = chi_tiet.map((item: any) => {
        const soLuong = parseFloat(item.so_luong);
        const donGia = parseFloat(item.don_gia);

        if (isNaN(soLuong) || isNaN(donGia) || soLuong <= 0) {
          throw new Error("Số lượng hoặc đơn giá của sản phẩm không hợp lệ.");
        }
        const thanhTien = soLuong * donGia;
        return {
          ...item,
          so_luong: soLuong,
          don_gia: donGia,
          thanh_tien: thanhTien,
        };
      });
      console.log("hoadonban controller",hdbanId,chiTietHoanChinh);

      await this.hdbanModal.updateHDBan(hdbanId, chiTietHoanChinh);

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

  async searchByKeyword(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        res.status(400).json({ message: "Từ khóa không được để trống" });
        return;
      }
      const result = await this.hdbanModal.searchByKeyword(keyword as string);
      res.status(200).json({
        success: true,
        message: "Tìm kiếm hóa đơn thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async thanhToan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;
      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "ID hóa đơn không hợp lệ",
        });
        return;
      }
      await this.hdbanModal.thanhToan(Number(id));
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

export default HDBanController;
