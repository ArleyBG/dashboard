import { Router } from "express";
import { 
  crearTareaController, 
  listarTareasController, 
  actualizarEstadoTareaController,
  asignarResponsableController,
  actualizarPrioridadTareaController
} from "../controllers/taskController.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = Router();

// Crear tarea (solo admin = role_id = 1)
router.post(
  "/", 
  verifyToken, 
  verifyRole([1]), 
  crearTareaController
);

// Listar tareas (admin=1, t1=2, t2=3)
// cada rol verá lo que le corresponda según la lógica en taskModel
router.get(
  "/", 
  verifyToken, 
  verifyRole([1, 2, 3]), 
  listarTareasController
);

// Actualizar estado de tarea (solo t1=2 o t2=3)
router.put(
  "/:id/estado", 
  verifyToken, 
  verifyRole([1, 2, 3]), 
  actualizarEstadoTareaController
);

// Asignar responsable 
router.put(
  "/:id/responsable",
  verifyToken,
  verifyRole([1, 2, 3]), 
  asignarResponsableController
);

// Actualizar prioridad
router.put("/:id/prioridad", verifyToken, verifyRole([1, 2, 3]), actualizarPrioridadTareaController);

export default router;
