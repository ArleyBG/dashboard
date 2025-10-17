import jwt from "jsonwebtoken";

// Middleware para verificar token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Si no llega el header, cortamos aquí
  if (!authHeader) {
    return res.status(403).json({ ok: false, message: "Falta el header Authorization" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ ok: false, message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role_id }
    next();
  } catch (error) {
    console.error("Error en verifyToken:", error);
    return res.status(401).json({ ok: false, message: "Token inválido" });
  }
};

// Middleware para verificar rol específico
export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({ ok: false, message: "No tienes permisos suficientes" });
    }
    next();
  };
};
