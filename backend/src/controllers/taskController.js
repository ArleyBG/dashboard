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

  console.log("Headers recibidos:", req.headers);
  console.log("Body recibido:", req.body);


  try {

    console.log("req.body recibido en backend:", req.body);

    const { title, description, type_id, assigned_role, assigned_to, start_date, end_date } = req.body;

    if (!title) {
      return res.status(400).json({ ok: false, message: "El título es obligatorio" });
    }

    const tarea = {
      title,
      description,
      type_id: type_id || null,
      state_id: 1, // estado inicial por defecto (ej: "Compromiso")
      assigned_role: assigned_role || null,
      assigned_to: assigned_to || null,
      created_by: req.user.id, // quien la crea
      start_date: start_date || null,
      end_date: end_date || null,
    };

    const id = await crearTarea(tarea);

    res.status(201).json({
      ok: true,
      message: "Tarea creada con éxito",
      id
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Listar todas las tareas (admin ve todas, t1/t2 solo lo suyo)
export const listarTareasController = async (req, res) => {
  try {
    const { role_id, id } = req.user;

    const tareas = await listarTareas(role_id, id);

    res.json({
      ok: true,
      tareas
    });
  } catch (error) {
    console.error("Error al listar tareas:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Actualizar estado de tarea
export const actualizarEstadoTareaController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;
    const estadoId = typeof nuevoEstado === "object" ? nuevoEstado.state_id : nuevoEstado;

    if (!nuevoEstado) {
      return res.status(400).json({ ok: false, message: "El nuevo estado es obligatorio" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) {
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    await actualizarEstadoTarea(id, estadoId, req.user.id);

    res.json({ ok: true, message: "Estado actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Asignar responsable a una tarea
export const asignarResponsableController = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;

    if (!assigned_to) {
      return res.status(400).json({ ok: false, message: "El responsable es obligatorio" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) {
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    await asignarResponsable(id, assigned_to, req.user.id);

    res.json({ ok: true, message: "Responsable asignado con éxito" });
  } catch (error) {
    console.error("Error al asignar responsable:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};

// Actualizar prioridad de tarea
export const actualizarPrioridadTareaController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevaPrioridad } = req.body;

    if (!nuevaPrioridad) {
      return res.status(400).json({ ok: false, message: "La nueva prioridad es obligatoria" });
    }

    const tarea = await buscarTareaPorId(id);
    if (!tarea) {
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    await actualizarPrioridadTarea(id, nuevaPrioridad, req.user.id);

    res.json({ ok: true, message: "Prioridad actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar prioridad:", error);
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
};