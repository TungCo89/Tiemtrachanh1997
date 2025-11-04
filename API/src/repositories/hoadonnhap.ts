import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class HDNhapRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllHoaDonNhap()";
      const [rows] = await this.db.query(sql);
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
      const sql = "CALL GetHoaDonNhapByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createHDNhap(
    id_ncc: number,
    ghi_chu: string,
    chiTietJson: string
  ): Promise<void> {
    console.log("du lieu hoadonnhap.res", id_ncc, ghi_chu, chiTietJson);
    const sql = "CALL CreateHoaDonNhap(?, ?, ?)"; //
    await this.db.query(sql, [id_ncc, ghi_chu, chiTietJson]);
  }

  async updateHDNhap(
    id:number,
    id_ncc: number,
    ghi_chu: string,
    chiTietJson: string
  ): Promise<void> {
    console.log("du lieu hoadonnhap.res",id, id_ncc, ghi_chu, chiTietJson);
    const sql = "CALL UpdateHoaDonNhap(?, ?, ?, ?)"; //
    await this.db.query(sql, [id, id_ncc, ghi_chu, chiTietJson]);
  }

  async deleteHDNhap(id: number): Promise<void> {
    console.log(id);
    const sql = "CALL DeleteHoaDonNhap(?)"; //
    await this.db.query(sql, [id]);
  }
  async searchByKeyword(keyword: string): Promise<any> {
    const sql = "CALL SearchHoaDonNhap(?)";
    const [results] = await this.db.query(sql, [keyword]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default HDNhapRepository;
