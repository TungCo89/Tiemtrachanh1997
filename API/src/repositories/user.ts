import { Pool } from "mysql2/promise";
import db from "../database";

export class UserRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllUsers()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getByID(id: number): Promise<any> {
    try {
      const sql = "CALL GetUserByID(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getRoles(): Promise<any> {
    try {
      const sql = "CALL getRoles()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserByUserEmail(email: string): Promise<any> {
    const sql = "CALL GetUserByEmail(?)";

    const [results] = await this.db.query(sql, [email]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }

  async signup(user: any): Promise<any> {
    try {
      const sql = "CALL CreateUser(?,?,?,?,?,?)";
      const [rows] = await this.db.query(sql, [
        user.ten_dang_nhap,
        user.mat_khau,
        user.ho_ten,
        user.email,
        user.so_dien_thoai,
        user.id_vai_tro,
      ]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async login(user: any): Promise<any> {
    try {
      const sql = "CALL login(?)";
      const [rows] = await this.db.query(sql, []);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(user: any): Promise<any> {
    try {
      const sql = "CALL UpdateUser(?,?,?,?,?,?,?)";
      const [rows] = await this.db.query(sql, [
        user.id,
        user.ten_dang_nhap,
        user.mat_khau,
        user.ho_ten,
        user.email,
        user.so_dien_thoai,
        user.id_vai_tro,
      ]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(id: number): Promise<any> {
    try {
      const sql = "CALL deleteNguoiDung(?)";
      const [rows] = await this.db.query(sql, [id]);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
    async searchByKeyword(keyword: string): Promise<any> {
    const sql = "CALL SearchUsers(?)";
    const [results] = await this.db.query(sql, [keyword]);
    if (Array.isArray(results)) {
      return results[0];
    }
    return [];
  }
}

export default UserRepository;
