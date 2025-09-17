import { Pool } from "mysql2/promise";
import db from "../database";

export class GiaoVienRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllGiaoVien()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default GiaoVienRepository;
