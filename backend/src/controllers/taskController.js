// src/controllers/taskController.js
import {
  crearTarea,
  listarTareas,
  buscarTareaPorId,
  actualizarEstadoTarea,
  asignarResponsable,
  actualizarPrioridadTarea
} from "../models/taskModel.js";

// Crear nueva tarea (solo admin)
export const crearTareaController = async (req, res) => {
  try {
    const b = req.body || {};

    // Normalizadores mínimos para evitar "" -> NaN
    const toIntOrNull = (v) => {
      if (v === "" || v === null || v === undefined) return null;
      if (typeof v === "object") return Number(v?.id ?? v?.value ?? v?.state_id ?? v?.type_id);
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const title         = b?.title ?? b?.titulo ?? null;
    const description   = b?.description ?? b?.descripcion ?? null;
    const type_id       = toIntOrNull(b?.type_id);
    const assigned_role = toIntOrNull(b?.assigned_role);
    const assigned_to   = toIntOrNull(b?.assigned_to);
    const start_date    = b?.start_date ?? null;
    const end_date      = b?.end_date ?? null;

    console.log("[POST /api/tasks] RAW BODY:", b);
    console.log("[POST /api/tasks] USER:", { id: req.user?.id, role_id: req.user?.role_id });

    if (!title) {
      console.warn("[POST /api/tasks] 400: falta title");
      return res.status(400).json({ ok: false, message: "El título es obligatorio" });
    }

    const tarea = {
      title,
      description,
      type_id: Number.isInteger(type_id) ? type_id : null,
      state_id: 1,
      assigned_role: Number.isInteger(assigned_role) ? assigned_role : null,
      assigned_to: Number.isInteger(assigned_to) ? assigned_to : null,
      created_by: req.user.id,
      start_date,
      end_date,
    };

    console.log("[POST /api/tasks] NORMALIZED TAREA:", tarea);

    const id = await crearTarea(tarea);
    console.log("[POST /api/tasks] CREATED ID:", id);

    return res.status(201).json({ ok: true, message: "Tarea creada con éxito", id });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Listar tareas
export const listarTareasController = async (req, res) => {
  try {
    console.log("[GET /api/tasks] USER:", { id: req.user?.id, role_id: req.user?.role_id });
    const { role_id, id } = req.user;
    const tareas = await listarTareas(role_id, id);
    return res.json({ ok: true, tareas });
  } catch (error) {
    console.error("Error al listar tareas:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Actualizar estado
export const actualizarEstadoTareaController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const raw = req.body?.nuevoEstado;
    const estadoId = (typeof raw === "object")
      ? Number(raw?.state_id ?? raw?.id ?? raw?.value)
      : Number(raw);

    console.log("[PUT /api/tasks/:id/estado] PARAMS:", req.params);
    console.log("[PUT /api/tasks/:id/estado] BODY:", req.body, "-> estadoId:", estadoId);

    if (!Number.isInteger(id) || !Number.isInteger(estadoId)) {
      console.warn("[PUT /api/tasks/:id/estado] 400: datos inválidos", { id, estadoId });
      return res.status(400).json({ ok: false, message: "Datos inválidos (id/estado)" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) {
      console.warn("[PUT /api/tasks/:id/estado] 404: tarea no encontrada", { id });
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    await actualizarEstadoTarea(id, estadoId, req.user.id);
    return res.json({ ok: true, message: "Estado actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Asignar responsable (permite null para limpiar)
export const asignarResponsableController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const raw = req.body?.assigned_to;

    const userId = (raw === "" || raw === null || raw === undefined)
      ? null
      : (typeof raw === "object" ? Number(raw?.id ?? raw?.value) : Number(raw));

    console.log("[PUT /api/tasks/:id/responsable] PARAMS:", req.params);
    console.log("[PUT /api/tasks/:id/responsable] BODY:", req.body, "-> assigned_to:", userId);

    if (!Number.isInteger(id)) {
      console.warn("[PUT /api/tasks/:id/responsable] 400: id inválido", { id });
      return res.status(400).json({ ok: false, message: "Datos inválidos (id/responsable)" });
    }
    if (!(userId === null || Number.isInteger(userId))) {
      console.warn("[PUT /api/tasks/:id/responsable] 400: responsable inválido", { userId });
      return res.status(400).json({ ok: false, message: "Responsable inválido" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) {
      console.warn("[PUT /api/tasks/:id/responsable] 404: tarea no encontrada", { id });
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    await asignarResponsable(id, userId, req.user.id);
    return res.json({ ok: true, message: "Responsable asignado con éxito" });
  } catch (error) {
    console.error("Error al asignar responsable:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Actualizar prioridad
export const actualizarPrioridadTareaController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const raw = req.body?.nuevaPrioridad;
    const prioridad = (typeof raw === "object")
      ? Number(raw?.id ?? raw?.value)
      : Number(raw);

    console.log("[PUT /api/tasks/:id/prioridad] PARAMS:", req.params);
    console.log("[PUT /api/tasks/:id/prioridad] BODY:", req.body, "-> prioridad:", prioridad);

    if (!Number.isInteger(id) || !Number.isInteger(prioridad)) {
      console.warn("[PUT /api/tasks/:id/prioridad] 400: datos inválidos", { id, prioridad });
      return res.status(400).json({ ok: false, message: "Datos inválidos (id/prioridad)" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) {
      console.warn("[PUT /api/tasks/:id/prioridad] 404: tarea no encontrada", { id });
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    await actualizarPrioridadTarea(id, prioridad, req.user.id);
    return res.json({ ok: true, message: "Prioridad actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar prioridad:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};
