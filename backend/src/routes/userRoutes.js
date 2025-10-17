import { Router } from "express";
import { listUsers } from "../controllers/userController.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = Router();

// Admin, T1 y T2 pueden ver usuarios (necesario para asignar responsables)
router.get("/", verifyToken, verifyRole([1, 2, 3]), listUsers);

export default router;
