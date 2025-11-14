import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class ThongKeRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  
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

  async getLoiNhuanSoBo(startDate: string, endDate: string): Promise<any> {
    const sql = "CALL GetLoiNhuanSoBo(?, ?)";
    const [results] = await this.db.query(sql, [startDate, endDate]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
  async getHieuSuatSanPham(
    startDate: string,
    endDate: string,
    topN: number
  ): Promise<any> {
    const sql = "CALL GetHieuSuatSanPham(?, ?, ?)";
    const [results] = await this.db.query(sql, [startDate, endDate, topN]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
    async getSoDonHang(
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const sql = "CALL GetSoDonHangByDateRange(?, ?)";
    const [results] = await this.db.query(sql, [startDate, endDate]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
    async getTonKhoNguyenLieu(
    ten_nguyen_lieu: string,
  ): Promise<any> {
    const sql = "CALL GetTonKhoNguyenLieu(?)";
    const [results] = await this.db.query(sql, [ten_nguyen_lieu]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default ThongKeRepository;
