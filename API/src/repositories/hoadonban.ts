import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class HDBanRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllHoaDonBan()";
      const [rows] = await this.db.query(sql);
      console.log(rows);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByID(id: number): Promise<any> {
    try {
      const sql = "CALL GetHoaDonBanByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByIDBan(id: number): Promise<any> {
    try {
      const sql = "CALL GetHoaDonBanByIDBan(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createHDBan(id_ban: number, chiTietJson: string): Promise<void> {
    console.log("du lieu hoadonban.res", id_ban, chiTietJson);
    const sql = "CALL CreateHoaDonBan(?, ?)"; //
    await this.db.query(sql, [id_ban, chiTietJson]);
  }

  async updateHDBan(id: number, chiTietJson: string): Promise<void> {
    console.log("du lieu hoadonban.res", id, chiTietJson);
    const sql = "CALL UpdateHoaDonBan(?,?)"; //
    await this.db.query(sql, [id, chiTietJson]);
  }

  async deleteHDBan(id: number): Promise<void> {
    const sql = "CALL DeleteHoaDonBan(?)"; //
    await this.db.query(sql, [id]);
  }

  async searchByKeyword(keyword: string): Promise<any> {
    const sql = "CALL SearchHoaDonBan(?)";
    const [results] = await this.db.query(sql, [keyword]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
  async thanhToan(id: number): Promise<void> {
    try {
      const sql = "CALL SearchHoaDonBan(?)";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(`Không thể thanh toán hóa đơn ${id}: ${error.message}`);
    }
  }
}

export default HDBanRepository;
