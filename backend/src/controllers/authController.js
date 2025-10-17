import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../models/userModel.js";

// Login
export const login = async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "").trim();

  try {
    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario por email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    // Validar contraseña encriptada
    const validar = await bcrypt.compare(password, user.password);
    if (!validar) {
      return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });
    }

    // Generar Token con el rol del usuario
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Responder al frontend con datos consistentes
    res.json({
      ok: true,
      token,
      role_id: user.role_id,
      user: {
        id: user.id,
        role_id: user.role_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Registro
export const register = async (req, res) => {
  const { cedula, name, email, role_id, password } = req.body;

  try {
    // Validar campos requeridos
    if (!cedula || !name || !email || !role_id || !password) {
      return res.status(400).json({ ok: false, message: "Todos los campos son obligatorios" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la DB
    await createUser({
      id: cedula, // cedula será el ID primario
      name,
      email: email.toLowerCase().trim(),
      role_id,
      password: hashedPassword,
    });

    res.status(201).json({ ok: true, message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error en registro:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ ok: false, message: "El usuario ya existe" });
    }

    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};
