// src/models/taskModel.js
import { pool } from "../config/db.js";

// Crear tarea
export const crearTarea = async (tarea) => {
  const {
    title,
    description,
    type_id,
    state_id,
    assigned_role,
    assigned_to,
    created_by,
    start_date,
    end_date,
  } = tarea;

  const [result] = await pool.query(
    `INSERT INTO tasks 
     (title, description, type_id, state_id, assigned_role, assigned_to, created_by, start_date, end_date) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      type_id,
      state_id,
      assigned_role,
      assigned_to,
      created_by,
      start_date,
      end_date,
    ]
  );

  console.log("[MODEL crearTarea] INSERT RESULT:", result);
  return result.insertId;
};

// Listar tareas con reglas según rol
export const listarTareas = async (rol, idUsuario) => {
  let query = `
    SELECT t.*, 
           u.name AS created_by_name, 
           p.name AS priority_name
    FROM tasks t
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN task_types p ON t.type_id = p.id
  `;
  let params = [];

  if (rol === 2 || rol === 3) {
    query += " WHERE t.assigned_role = ? OR t.assigned_to = ?";
    params = [rol, idUsuario]; 
  }

  const [rows] = await pool.query(query, params);
  console.log("[MODEL listarTareas] rol:", rol, "idUsuario:", idUsuario, "count:", rows.length);
  return rows;
};

// Buscar tarea por ID
export const buscarTareaPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT t.*, 
            u.name AS created_by_name, 
            p.name AS priority_name
     FROM tasks t
     LEFT JOIN users u ON t.created_by = u.id
     LEFT JOIN task_types p ON t.type_id = p.id
     WHERE t.id = ?`, 
    [id]
  );
  console.log("[MODEL buscarTareaPorId] id:", id, "found:", rows.length);
  return rows[0] || null;
};

// Actualizar estado de una tarea y guardar en historial
export const actualizarEstadoTarea = async (id, nuevoEstado, actorId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [estadoRows] = await conn.query(
      "SELECT id FROM task_states WHERE id = ?",
      [nuevoEstado]
    );
    console.log("[MODEL actualizarEstado] validate state:", nuevoEstado, "exists:", estadoRows.length > 0);
    if (estadoRows.length === 0) {
      throw new Error(`El estado ${nuevoEstado} no existe en task_states`);
    }

    const [rows] = await conn.query(
      "SELECT state_id, assigned_to FROM tasks WHERE id = ?",
      [id]
    );
    const tarea = rows[0];
    console.log("[MODEL actualizarEstado] current:", tarea);
    if (!tarea) throw new Error("Tarea no encontrada");

    await conn.query("UPDATE tasks SET state_id = ? WHERE id = ?", [
      nuevoEstado,
      id,
    ]);

    await conn.query(
      `INSERT INTO task_history 
       (task_id, actor_id, prev_state_id, new_state_id, prev_assigned_to, new_assigned_to) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, actorId, tarea.state_id, nuevoEstado, tarea.assigned_to, tarea.assigned_to]
    );

    await conn.commit();
    console.log("[MODEL actualizarEstado] OK ->", { id, from: tarea.state_id, to: nuevoEstado });
  } catch (error) {
    await conn.rollback();
    console.error("Error en actualizarEstadoTarea:", error);
    throw error;
  } finally {
    conn.release();
  }
};

// Asignar responsable (permite null) y guardar en historial
export const asignarResponsable = async (id, nuevoResponsable, actorId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT state_id, assigned_to FROM tasks WHERE id = ?",
      [id]
    );
    const tarea = rows[0];
    console.log("[MODEL asignarResponsable] current:", tarea, "new:", nuevoResponsable);
    if (!tarea) throw new Error("Tarea no encontrada");

    await conn.query("UPDATE tasks SET assigned_to = ? WHERE id = ?", [
      nuevoResponsable,
      id,
    ]);

    await conn.query(
      `INSERT INTO task_history 
       (task_id, actor_id, prev_state_id, new_state_id, prev_assigned_to, new_assigned_to) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, actorId, tarea.state_id, tarea.state_id, tarea.assigned_to, nuevoResponsable]
    );

    await conn.commit();
    console.log("[MODEL asignarResponsable] OK ->", { id, from: tarea.assigned_to, to: nuevoResponsable });
  } catch (error) {
    await conn.rollback();
    console.error("Error en asignarResponsable:", error);
    throw error;
  } finally {
    conn.release();
  }
};

// Actualizar prioridad de una tarea
export const actualizarPrioridadTarea = async (id, nuevaPrioridad, actorId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [prioRows] = await conn.query(
      "SELECT id FROM task_types WHERE id = ?",
      [nuevaPrioridad]
    );
    console.log("[MODEL actualizarPrioridad] validate type:", nuevaPrioridad, "exists:", prioRows.length > 0);
    if (prioRows.length === 0) {
      throw new Error(`La prioridad ${nuevaPrioridad} no existe en task_types`);
    }

    const [rows] = await conn.query("SELECT id FROM tasks WHERE id = ?", [id]);
    console.log("[MODEL actualizarPrioridad] task exists:", rows.length > 0);
    if (rows.length === 0) throw new Error("Tarea no encontrada");

    await conn.query("UPDATE tasks SET type_id = ? WHERE id = ?", [
      nuevaPrioridad,
      id,
    ]);

    await conn.commit();
    console.log("[MODEL actualizarPrioridad] OK ->", { id, type_id: nuevaPrioridad });
  } catch (error) {
    await conn.rollback();
    console.error("Error en actualizarPrioridadTarea:", error);
    throw error;
  } finally {
    conn.release();
  }
};
