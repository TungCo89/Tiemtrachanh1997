import { Request, Response } from "express";
import SanPhamModal from "../modal/sanpham";

export class UserController {
  private sanphamModal: SanPhamModal;

  constructor(sanphamModal: SanPhamModal) {
    this.sanphamModal = sanphamModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.sanphamModal.getAll();
      res.status(200).json({ success: true, message: "Lấy thông tin thành công", data: result });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
}

export default UserController;
