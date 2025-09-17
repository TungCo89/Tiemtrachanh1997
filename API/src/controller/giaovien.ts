import { Request, Response } from "express";
import GiaoVienModal from "../modal/giaovien";

export class UserController {
  private giaovienModal: GiaoVienModal;

  constructor(giaovienModal: GiaoVienModal) {
    this.giaovienModal = giaovienModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.giaovienModal.getAll();
      res.status(200).json({ success: true, message: "Lấy thông tin thành công", data: result });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
}

export default UserController;
