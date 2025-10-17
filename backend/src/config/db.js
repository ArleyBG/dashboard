// src/db.js (o donde tengas tu pool)
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const hasUrl = !!process.env.DATABASE_URL;

// Opción A: Connection URL (recomendada)
const pool = hasUrl
  ? mysql.createPool({
      uri: process.env.DATABASE_URL, 
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    })
  // Opción B: variables separadas (fallback)
  : mysql.createPool({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });

export { pool };
