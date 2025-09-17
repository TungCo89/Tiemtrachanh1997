import { Request, Response } from "express";
import UserModal from "../modal/user";

export class UserController {
  private userModal: UserModal;

  constructor(userModal: UserModal) {
    this.userModal = userModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userModal.getAll();
      res
        .status(200)
        .json({
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
      const id = parseInt(req.query.is as string);
      const result = await this.userModal.getByID(id);
      res
        .status(200)
        .json({
          success: true,
          message: "Lấy thông tin thành công",
          data: result,
        });
    } catch (error: any) {
      console.error("Lỗi khi lấy thông tin:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async getRoles(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userModal.getRoles();
      res
        .status(200)
        .json({
          success: true,
          message: "Lấy thông tin thành công",
          data: result,
        });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async getByKhoaHoc(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.query.is as string);
      const result = await this.userModal.getByKhoaHoc(id);
      res
        .status(200)
        .json({
          success: true,
          message: "Lấy thông tin thành công",
          data: result,
        });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { Ten, Email, MatKhau, SoDienThoai, VaiTro = 1 } = req.body;
      const user = { Ten, Email, MatKhau, SoDienThoai, VaiTro };
      const result = await this.userModal.signup(user);
      res
        .status(200)
        .json({
          success: true,
          message: "Thêm thông tin thành công",
          data: result,
        });
    } catch (error: any) {
      console.error("Lỗi khi thêm:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { Ten, Email, MatKhau, SoDienThoai, VaiTro  } = req.body;
      const user = { Ten, Email, MatKhau, SoDienThoai, VaiTro };
      const result = await this.userModal.login(user);
      res
        .status(200)
        .json({
          success: true,
          message: "Lấy thông tin thành công",
          data: result,
        });
    } catch (error: any) {
      console.error("Lỗi khi lấy thoong tin:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { Ten, Email, MatKhau, SoDienThoai, VaiTro } = req.body;
      const user = { Ten, Email, MatKhau, SoDienThoai, VaiTro };
      const result = await this.userModal.update(user);
      res
        .status(200)
        .json({
          success: true,
          message: "Lấy thông tin thành công",
          data: result,
        });
    } catch (error: any) {
      console.error("Lỗi khi lấy thoong tin:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.query.is as string);
      const result = await this.userModal.delete(id);
      res
        .status(200)
        .json({
          success: true,
          message: "Xóa thông tin thành công",
          data: result,
        });
    } catch (error: any) {
      console.error("Lỗi khi xóa thông tin:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
}

export default UserController;
