import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class NCCRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllNCC()";
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
      const sql = "CALL GetNCCByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getNguyenLieubyNCCID(id: number): Promise<any> {
    try {
      const sql = "CALL GetNguyenLieuByNCCID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  // ten_ncc, dia_chi, so_dien_thoai
  async createNCC(
    ten_ncc: string,
    dia_chi: string,
    so_dien_thoai: number
  ): Promise<void> {
    const sql = "CALL CreateNCC(?, ?, ?)";
    await this.db.query(sql, [ten_ncc, dia_chi, so_dien_thoai]);
  }

  async updateNCC(
    id: number,
    ten_ncc: string,
    dia_chi: string,
    so_dien_thoai: number
  ): Promise<void> {
    const sql = "CALL UpdateNCC(?, ?, ?, ?)";
    await this.db.query(sql, [id, ten_ncc, dia_chi, so_dien_thoai]);
  }

  async deleteNCC(id: number): Promise<void> {
    const sql = "CALL DeleteNCC(?)";
    await this.db.query(sql, [id]);
  }

  async searchNCCByKeyword(keyword: string): Promise<any> {
    const sql = "CALL SearchNCC(?)";
    const [results] = await this.db.query(sql, [keyword]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default NCCRepository;
