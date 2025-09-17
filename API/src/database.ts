import mysql, {Pool} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); 


const db: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'TTTMy2403',
  database: process.env.DB_NAME || 'LuyenThi912',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
