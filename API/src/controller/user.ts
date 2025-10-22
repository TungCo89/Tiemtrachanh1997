import { Request, Response } from "express";
import UserModal from "../modal/user";
import * as bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export class UserController {
  private userModal: UserModal;

  constructor(userModal: UserModal) {
    this.userModal = userModal;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userModal.getAll();
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
      const result = await this.userModal.getByID(Number(id));
      res.status(200).json({
        success: true,
        message: "Lấy thông tin thành công",
        data: result,
      });
    } catch (error: any) {
      console.error("Lỗi khi lấy thông tin:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
    async getUserByUserEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const result = await this.userModal.getUserByUserEmail(email as string);
      res.status(200).json({
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

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const {
        ten_dang_nhap,
        mat_khau,
        ho_ten,
        email,
        so_dien_thoai,
        id_vai_tro,
      } = req.body;
      const hashedPassword = await bcrypt.hash(mat_khau, SALT_ROUNDS);
      const user = {
        ten_dang_nhap,
        mat_khau: hashedPassword,
        ho_ten,
        email,
        so_dien_thoai,
        id_vai_tro: id_vai_tro || 2,
      };
      const result = await this.userModal.signup(user);
      res.status(200).json({
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
      const { email, mat_khau } = req.body;
      if (!email || !mat_khau) {
        res.status(400).json({
          success: false,
          message: "Vui lòng nhập email và mật khẩu.",
        }); return
      }
      const userFromDB = await this.userModal.getUserByUserEmail(email);
      if (!userFromDB) {
        res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng.",
        }); return
      }
      const isPasswordValid = await bcrypt.compare(
        mat_khau,
        userFromDB.mat_khau
      );

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng.",
        }); return
      }
      const { mat_khau: _, ...userData } = userFromDB;
      console.log(userFromDB);
      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: userData,
      });
    } catch (error: any) {
      console.error("Lỗi khi lấy thông tin:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.id as string;
      const userId = Number(id);

      if (isNaN(userId)) {
        res.status(400).json({ message: "ID không hợp lệ." });
        return;
      }
      const {
        ten_dang_nhap,
        mat_khau,
        ho_ten,
        email,
        so_dien_thoai,
        id_vai_tro,
      } = req.body;
      const user: any = {
        id: userId,
        ten_dang_nhap,
        ho_ten,
        email,
        so_dien_thoai,
        id_vai_tro,
      };
      if (mat_khau && mat_khau.trim() !== "") {
        const hashedPassword = await bcrypt.hash(mat_khau, SALT_ROUNDS);
        user.mat_khau = hashedPassword;
      }
      const result = await this.userModal.update(user);
      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        data: result,
      });
    } catch (error: any) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.query.is as string);
      const result = await this.userModal.delete(id);
      res.status(200).json({
        success: true,
        message: "Xóa thông tin thành công",
        data: result,
      });
    } catch (error: any) {
      console.error("Lỗi khi xóa thông tin:", error);
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
      const result = await this.userModal.searchByKeyword(
        keyword as string
      );
      res.status(200).json({
        success: true,
        message: "Tìm kiếm người dùng thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

}

export default UserController;
