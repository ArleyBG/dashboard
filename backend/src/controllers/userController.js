import { findAllUsers } from "../models/userModel.js";

export const listUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.json({ ok: true, users });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};