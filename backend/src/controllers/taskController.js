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
    const body = req.body || {};
    const {
      title,
      description = null,
      type_id = null,
      assigned_role = null,
      assigned_to = null,
      start_date = null,
      end_date = null,
    } = body;

    if (!title) {
      return res.status(400).json({ ok: false, message: "El título es obligatorio" });
    }

    const tarea = {
      title,
      description,
      type_id: type_id ? Number(type_id) : null,
      state_id: 1, // estado inicial
      assigned_role: assigned_role ? Number(assigned_role) : null,
      assigned_to: assigned_to ? Number(assigned_to) : null,
      created_by: req.user.id,
      start_date,
      end_date,
    };

    const id = await crearTarea(tarea);
    return res.status(201).json({ ok: true, message: "Tarea creada con éxito", id });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Listar tareas
export const listarTareasController = async (req, res) => {
  try {
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
    const body = req.body || {};
    const nuevoEstado = typeof body === "object" ? body.nuevoEstado : undefined;
    const estadoId = typeof nuevoEstado === "object" ? Number(nuevoEstado?.state_id) : Number(nuevoEstado);

    if (!id || !Number.isInteger(estadoId)) {
      return res.status(400).json({ ok: false, message: "Datos inválidos (id/estado)" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) return res.status(404).json({ ok: false, message: "Tarea no encontrada" });

    await actualizarEstadoTarea(id, estadoId, req.user.id);
    return res.json({ ok: true, message: "Estado actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Asignar responsable
export const asignarResponsableController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { assigned_to } = req.body || {};
    const userId = Number(assigned_to);

    if (!id || !userId) {
      return res.status(400).json({ ok: false, message: "Datos inválidos (id/responsable)" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) return res.status(404).json({ ok: false, message: "Tarea no encontrada" });

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
    const { nuevaPrioridad } = req.body || {};
    const prioridad = Number(nuevaPrioridad);

    if (!id || !Number.isInteger(prioridad)) {
      return res.status(400).json({ ok: false, message: "Datos inválidos (id/prioridad)" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) return res.status(404).json({ ok: false, message: "Tarea no encontrada" });

    await actualizarPrioridadTarea(id, prioridad, req.user.id);
    return res.json({ ok: true, message: "Prioridad actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar prioridad:", error);
    return res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};
