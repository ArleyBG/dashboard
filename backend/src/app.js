// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { pool } from "./config/db.js"; 

dotenv.config();
const app = express();

// CORS permisivo a localhost y vercel (ajústalo si deseas)
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  /\.vercel\.app$/, // previews de vercel
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
    return ok ? cb(null, true) : cb(new Error(`CORS not allowed: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Healthcheck
app.get("/health", (req, res) => res.status(200).send("ok"));

// Ruta base
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Servidor activo" });
});

// Arranque + ping a DB
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`API escuchando en :${PORT}`);
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    console.log("DB OK:", rows[0]);
  } catch (err) {
    console.error("Error conectando a la DB:", err?.message || err);
  }
});

export default app;
