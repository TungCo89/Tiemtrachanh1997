import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class LoaiSanPhamRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllLoaiSanPham()";
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
      const sql = "CALL GetLoaiSanPhamByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createLoaiSanPham(ten_loai: string): Promise<void> {
    const sql = "CALL CreateLoaiSanPham(?)";
    await this.db.query(sql, [ten_loai]);
  }

  async updateLoaiSanPham(id: number, ten_loai: string): Promise<void> {
    const sql = "CALL UpdateLoaiSanPham(?, ?)";
    await this.db.query(sql, [id, ten_loai]);
  }

  async deleteLoaiSanPham(id: number): Promise<void> {
    const sql = "CALL DeleteLoaiSanPham(?)";
    await this.db.query(sql, [id]);
  }

  async searchLoaiSanPhamByName(name: string): Promise<any> {
    const sql = "CALL SearchLoaiSanPhamByName(?)";
    const [results] = await this.db.query(sql, [name]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default LoaiSanPhamRepository;
