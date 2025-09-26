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

      await this.hdnhapModal.createHDNhap(id_ncc, ghi_chu, chi_tiet);

      res.status(201).json({
        success: true,
        message: "Thêm thành công",
      });
    } catch (error: any) {
      console.error("Lỗi khi tạo HD nhập:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  // async updateHDNhap(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.query;
  //     const hdnhapId = Number(id);
  //     const { ten_san_pham, gia_ban, mo_ta, id_loai, cong_thuc } = req.body;

  //     if (isNaN(hdnhapId)) {
  //       res.status(400).json({ message: "ID không hợp lệ." });
  //       return;
  //     }

  //     await this.hdnhapModal.updateHDNhap(
  //       hdnhapId,
  //       ten_san_pham,
  //       gia_ban,
  //       mo_ta,
  //       id_loai,
  //       cong_thuc
  //     );

  //     res.status(200).json({
  //       success: true,
  //       message: "Cập nhật thành công.",
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  //   }
  // }

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

  // async searchHDNhapByName(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { name } = req.query;
  //     if (!name) {
  //       res.status(400).json({ message: "Tên không được để trống" });
  //       return;
  //     }
  //     const result = await this.hdnhapModal.searchHDNhapByName(
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

export default HDNhapController;
