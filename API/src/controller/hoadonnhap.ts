import { Request, Response } from "express";
import HDNhapModal from "../modal/hoadonnhap";

export class HDNhapController {
  private hdnhapModal: HDNhapModal;

  constructor(hdnhapModal: HDNhapModal) {
    this.hdnhapModal = hdnhapModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.hdnhapModal.getAll();
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
      const result = await this.hdnhapModal.getByID(Number(id));
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

  async createHDNhap(req: Request, res: Response): Promise<void> {
    try {
        const { id_ncc, ghi_chu, chi_tiet } = req.body;
        const chiTiet = chi_tiet.map((item: any) => {
            const soLuong = parseFloat(item.so_luong);
            const donGia = parseFloat(item.don_gia);
            if (isNaN(soLuong) || isNaN(donGia) || soLuong <= 0 || donGia <= 0) {
                throw new Error("Số lượng hoặc đơn giá của nguyên liệu không hợp lệ."); 
            }
            // Tính thành tiền = số lượng * đơn giá
            const thanhTien = soLuong * donGia;
            return {
                ...item,
                so_luong: soLuong,
                don_gia: donGia,  
                thanh_tien: thanhTien 
            };
        });
        await this.hdnhapModal.createHDNhap(id_ncc, ghi_chu, chiTiet);
        res.status(201).json({
            success: true,
            message: "Tạo hóa đơn nhập thành công."
        });
        
    } catch (error: any) {
        console.error("Lỗi khi tạo HD nhập:", error);
        const statusCode = error.message.includes("không hợp lệ") ? 400 : 500;
        res.status(statusCode).json({ success: false, message: "Lỗi máy chủ", error: error.message });
    }
}

  async updateHDNhap(req: Request, res: Response): Promise<void> {
    try {
      const { id} = req.query;
      const hdnhapId = Number(id);
      const { id_ncc, ghi_chu, chi_tiet } = req.body;
      const chiTietHoanChinh = chi_tiet.map((item: any) => {
            const soLuong = parseFloat(item.so_luong);
            const donGia = parseFloat(item.don_gia);
            if (isNaN(soLuong) || isNaN(donGia) || soLuong <= 0 || donGia <= 0) {
                throw new Error("Số lượng hoặc đơn giá của nguyên liệu không hợp lệ."); 
            }
            // Tính thành tiền = số lượng * đơn giá
            const thanhTien = soLuong * donGia;
            return {
                ...item,
                so_luong: soLuong,
                don_gia: donGia,  
                thanh_tien: thanhTien 
            };
        });

      if (isNaN(hdnhapId)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }
      await this.hdnhapModal.updateHDNhap(hdnhapId,id_ncc, ghi_chu, chiTietHoanChinh);

      res.status(200).json({
        success: true,
        message: "Cập nhật thành công.",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async deleteHDNhap(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const hdnhapId = Number(id);

      if (isNaN(hdnhapId)) {
        res.status(400).json({ message: "ID  không hợp lệ" });
        return;
      }

      await this.hdnhapModal.deleteHDNhap(hdnhapId);
      res
        .status(200)
        .json({ success: true, message: "Xóa thành công" });
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
      const result = await this.hdnhapModal.searchByKeyword(keyword as string);
      res.status(200).json({
        success: true,
        message: "Tìm kiếm hóa đơn thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

}

export default HDNhapController;
