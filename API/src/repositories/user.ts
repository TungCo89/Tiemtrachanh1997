import { Pool } from "mysql2/promise";
import db from "../database";

export class UserRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<any> {
    try {
      const sql = "CALL GetAllNguoiDung()";
      const [rows] = await this.db.query(sql);
      return rows;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getByID(id: number): Promise<any> {
    try {
      const sql = "CALL getNguoiDungByID(?)";
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

  async signup(id: number): Promise<any> {
    try {
      const sql = "CALL signup(?)";
      const [rows] = await this.db.query(sql, []);
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
  async update(id: number): Promise<any> {
    try {
      const sql = "CALL updateNguoiDung(?)";
      const [rows] = await this.db.query(sql, []);
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
}

export default UserRepository;
