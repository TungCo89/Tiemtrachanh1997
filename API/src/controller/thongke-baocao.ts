import { Request, Response } from "express";
import ThongKeModal from "../modal/thongke-baocao";

export class ThongKeController {
  private thongkeModal: ThongKeModal;

  constructor(thongkeModal: ThongKeModal) {
    this.thongkeModal = thongkeModal;
  }

  async getDoanhThu(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };

      const data = await this.thongkeModal.getDoanhThu(startDate, endDate);

      res.status(200).json({
        success: true,
        message: "Thống kê doanh thu thành công.",
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getLoiNhuanSoBo(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };

      const data = await this.thongkeModal.getLoiNhuanSoBo(startDate, endDate);

      res.status(200).json({
        success: true,
        message: "Thống kê lợi nhuận sơ bộ thành công.",
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getHieuSuatSanPham(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, topN } = req.query as {
        startDate: string;
        endDate: string;
        topN?: string;
      };

      const n = topN ? parseInt(topN, 10) : 10; // Mặc định lấy Top 10

      const data = await this.thongkeModal.getHieuSuatThongKe(
        startDate,
        endDate,
        n
      );

      res.status(200).json({
        success: true,
        message: "Thống kê hiệu suất sản phẩm thành công.",
        data: data,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default ThongKeController;
