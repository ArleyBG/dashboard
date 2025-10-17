import { pool } from "../config/db.js";

// Buscar usuario por email
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
};

// Buscar usuario por ID (cédula)
export const findUserById = async (id) => {
  const [rows] = await pool.query("SELECT id, name, email, role_id FROM users WHERE id = ?", [id]);
  return rows[0] || null;
};

// Listar todos los usuarios
export const findAllUsers = async () => {
  const [rows] = await pool.query("SELECT id, name FROM users ORDER BY name ASC");
  return rows;
};

// Crear usuario nuevo
export const createUser = async ({ id, name, email, role_id, password }) => {
  const [result] = await pool.query(
    "INSERT INTO users (id, name, role_id, email, password) VALUES (?, ?, ?, ?, ?)",
    [id, name, role_id, email, password] 
  );
  return id; 
};
