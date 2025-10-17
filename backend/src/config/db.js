// backend/src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Prioriza DATABASE_URL (Railway Internal URL) y usa fallback con variables MYSQL*
export const pool = process.env.DATABASE_URL
  // Ej: mysql://user:pass@mysql.railway.internal:3306/railway
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT ? Number(process.env.MYSQLPORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });
