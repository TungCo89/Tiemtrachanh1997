import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class SanPhamRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllSanPhamVaCongThuc()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByID(id: number): Promise<any> {
    try {
      const sql = "CALL GetSanPhamVaCongThucByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createSanPham(
    ten_san_pham: string,
    gia_ban: number,
    mo_ta: string,
    id_loai: number,
    cong_thuc: any[]
  ): Promise<void> {
    const congThucJson = JSON.stringify(cong_thuc);
    console.log(
      "du lieu sanpham.res",
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      congThucJson
    );
    const sql = "CALL ThemSanPhamVaCongThuc(?, ?, ?, ?, ?)"; //
    await this.db.query(sql, [
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      congThucJson,
    ]);
  }

  async updateSanPham(
    id: number,
    ten_san_pham: string,
    gia_ban: number,
    mo_ta: string,
    id_loai: number,
    cong_thuc: any[]
  ): Promise<void> {
    const congThucJson = JSON.stringify(cong_thuc);
    console.log(
      "du lieu sanpham.res",
      id,
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      congThucJson
    );
    const sql = "CALL UpdateSanPhamVaCongThuc(?, ?, ?, ?, ?, ?)"; // 
    await this.db.query(sql, [
      id,
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      congThucJson,
    ]);
  }

  async deleteSanPham(id: number): Promise<void> {
    console.log(id);
    const sql = "CALL DeleteSanPham(?)"; //
    await this.db.query(sql, [id]);
  }

  async searchSanPhamByName(name: string): Promise<any> {
    const sql = "CALL SearchSanPhamByName(?)";
    const [results] = await this.db.query(sql, [name]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default SanPhamRepository;
