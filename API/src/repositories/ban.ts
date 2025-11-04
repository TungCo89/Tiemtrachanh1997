import { Pool } from "mysql2/promise";
import db from "../database";
import { QueryResult } from "mysql2/promise";

export class BanRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllBan()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByID(id: number): Promise<any> {
    try {
      const sql = "CALL GetBanByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getBanByIDKhuVuc(id: number): Promise<any> {
    try {
      const sql = "CALL GetBanByKhuVuc(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createBan(ten_ban: string, id_khu_vuc: number): Promise<void> {
    const sql = "CALL CreateBan(?,?)";
    await this.db.query(sql, [ten_ban, id_khu_vuc]);
  }

  async updateBan(
    id: number,
    ten_ban: string,
    trang_thai: string,
    id_khu_vuc: number
  ): Promise<void> {
    const sql = "CALL UpdateBan(?, ?, ?, ?)";
    await this.db.query(sql, [id, ten_ban, trang_thai, id_khu_vuc]);
  }

  async deleteBan(id: number): Promise<void> {
    const sql = "CALL DeleteBan(?)";
    await this.db.query(sql, [id]);
  }

  // async searchBanByName(name: string): Promise<any> {
  //   const sql = "CALL SearchBanByName(?)";
  //   const [results] = await this.db.query(sql, [name]);
  //   if (Array.isArray(results)) {
  //     return results[0];
  //   }
  //   return [];
  // }
  async donBan(id: number): Promise<void> {
    try {
      const sql = "CALL DonBan(?)";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(`Không thể bàn ${id}: ${error.message}`);
    }
  }
  async thanhToan(id: number): Promise<void> {
    try {
      const sql = "CALL ThanhToanHDByIDBan(?)";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(`Không thể thanh toán hóa đơn ${id}: ${error.message}`);
    }
  }
}

export default BanRepository;
