// Conexion a DB
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10, // Hasta 10 conexiones simultáneas
  queueLimit: 0,       // Sin límite en la cola
  multipleStatements: true // ejecutar DROP + CREATE 
});

console.log("Conexión a la base de datos establecida");
