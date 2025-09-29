import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class ThongKeRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  /**
   * Lấy Doanh Thu theo khoảng thời gian
   * @param startDate Ngày bắt đầu (YYYY-MM-DD)
   * @param endDate Ngày kết thúc (YYYY-MM-DD)
   * @returns Mảng kết quả từ DB
   */
  async getDoanhThuByDateRange(
    startDate: string,
    endDate: string
  ): Promise<any> {
    const sql = "CALL GetDoanhThuByDateRange(?, ?)";
    const [results] = await this.db.query(sql, [startDate, endDate]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }

  /**
   * Lấy Lợi Nhuận Sơ Bộ theo khoảng thời gian
   * @param startDate Ngày bắt đầu (YYYY-MM-DD)
   * @param endDate Ngày kết thúc (YYYY-MM-DD)
   * @returns Mảng kết quả từ DB
   */
  async getLoiNhuanSoBo(startDate: string, endDate: string): Promise<any> {
    const sql = "CALL GetLoiNhuanSoBo(?, ?)";
    const [results] = await this.db.query(sql, [startDate, endDate]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }

  /**
   * Lấy Hiệu Suất Sản Phẩm (Sản phẩm bán chạy)
   * @param startDate Ngày bắt đầu (YYYY-MM-DD)
   * @param endDate Ngày kết thúc (YYYY-MM-DD)
   * @param topN Số lượng sản phẩm top muốn lấy
   * @returns Mảng kết quả từ DB
   */
  async getHieuSuatThongKe(
    startDate: string,
    endDate: string,
    topN: number
  ): Promise<any> {
    const sql = "CALL GetHieuSuatThongKe(?, ?, ?)";
    const [results] = await this.db.query(sql, [startDate, endDate, topN]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default ThongKeRepository;
