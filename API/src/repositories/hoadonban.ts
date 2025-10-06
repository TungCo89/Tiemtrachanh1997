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

  async createHDBan(chi_tiet: any[]): Promise<void> {
    const chiTietJson = JSON.stringify(chi_tiet);
    const sql = "CALL CreateHoaDonBan(?)";
    await this.db.query(sql, [chiTietJson]);
  }

  async updateHDBan(id: number, chi_tiet: any[]): Promise<void> {
    const congThucJson = JSON.stringify(chi_tiet);
    const sql = "CALL UpdateHoaDonBan(?,?)";
    await this.db.query(sql, [id, congThucJson]);
  }

  async deleteHDBan(id: number): Promise<void> {
    const sql = "CALL DeleteHoaDonBan(?)";
    await this.db.query(sql, [id]);
  }

  // async searchHDBanByName(name: string): Promise<any> {
  //   const sql = "CALL SearchHDBanByName(?)";
  //   const [results] = await this.db.query(sql, [name]);
  //   if (Array.isArray(results)) {
  //     return results[0];
  //   }
  //   return [];
  // }
}

export default HDBanRepository;
