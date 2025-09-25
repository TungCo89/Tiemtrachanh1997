import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class NguyenLieuRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllNguyenLieu()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByID(id: number): Promise<any> {
    try {
      const sql = "CALL GetNguyenLieuByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllByNCC(): Promise<any> {
    try {
      const sql = "CALL GetAllNguyenLieuByNCC()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByIDNCC(id: number): Promise<any> {
    try {
      const sql = "CALL GetNguyenLieuByNCCID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createNguyenLieu(
    ten_nguyen_lieu: string,
    don_vi: number
  ): Promise<void> {
    const sql = "CALL CreateNguyeLieu(?, ?)";
    await this.db.query(sql, [ten_nguyen_lieu, don_vi]);
  }

  async updateNguyenLieu(
    id: number,
    ten_nguyen_lieu: string,
    don_vi: number
  ): Promise<void> {
    const sql = "CALL UpdateNguyenLieu(?, ?, ?)";
    await this.db.query(sql, [id, ten_nguyen_lieu, don_vi]);
  }

  async deleteNguyenLieu(id: number): Promise<void> {
    const sql = "CALL DeleteNguyenLieu(?)";
    await this.db.query(sql, [id]);
  }

  async searchNguyenLieuByName(name: string): Promise<any> {
    const sql = "CALL SearchNguyenLieuByName(?)";
    const [results] = await this.db.query(sql, [name]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default NguyenLieuRepository;
