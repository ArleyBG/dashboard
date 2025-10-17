import { pool } from "./src/config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    console.log("Iniciando migración...");

    // Ruta absoluta del db.sql siempre relativa a migrate.js
    const sqlPath = path.join(__dirname, "sql", "db.sql");

    // Leer el archivo
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Ejecutar script
    await pool.query(sql);

    console.log("Migración completada con éxito");
    process.exit(0);
  } catch (err) {
    console.error("Error en la migración:", err.message);
    process.exit(1);
  }
}

migrate();
