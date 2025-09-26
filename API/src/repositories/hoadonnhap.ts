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
      return rows;
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
    chi_tiet: any[]
  ): Promise<void> {
    const chiTietJson = JSON.stringify(chi_tiet);
    const sql = "CALL CreateHoaDonNhap(?, ?, ?)";
    await this.db.query(sql, [id_ncc, ghi_chu, chiTietJson]);
  }

  // async updateHDNhap(
  //   id: number,
  //   ten_san_pham: string,
  //   gia_ban: number,
  //   mo_ta: string,
  //   id_loai: number,
  //   cong_thuc: any[]
  // ): Promise<void> {
  //   const congThucJson = JSON.stringify(cong_thuc);
  //   const sql = "CALL UpdateHDNhap(?, ?, ?, ?, ?, ?)";
  //   await this.db.query(sql, [
  //     id,
  //     ten_san_pham,
  //     gia_ban,
  //     mo_ta,
  //     id_loai,
  //     congThucJson,
  //   ]);
  // }

  async deleteHDNhap(id: number): Promise<void> {
    const sql = "CALL DeleteHoaDonNhap(?)";
    await this.db.query(sql, [id]);
  }

  // async searchHDNhapByName(name: string): Promise<any> {
  //   const sql = "CALL SearchHDNhapByName(?)";
  //   const [results] = await this.db.query(sql, [name]);
  //   if (Array.isArray(results)) {
  //     return results[0];
  //   }
  //   return [];
  // }
}

export default HDNhapRepository;
