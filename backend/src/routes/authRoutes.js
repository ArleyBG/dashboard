import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { findUserById } from "../models/userModel.js"; 

const router = Router();

// Rutas de autenticación
router.post("/login", login);
router.post("/register", register);

// Ruta protegida para obtener perfil
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    res.json({
      ok: true,
      user: {
        id: user.id,
        role_id: user.role_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
});

export default router;
