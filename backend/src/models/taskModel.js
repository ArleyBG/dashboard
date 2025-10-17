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

  return result.insertId;
};

// Listar tareas con reglas según rol (join con users y prioridades)
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
  return rows[0] || null;
};

// Actualizar estado de una tarea y guardar en historial
export const actualizarEstadoTarea = async (id, nuevoEstado, actorId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Validar que el estado existe en task_states
    const [estadoRows] = await conn.query(
      "SELECT id FROM task_states WHERE id = ?",
      [nuevoEstado]
    );
    if (estadoRows.length === 0) {
      throw new Error(`El estado ${nuevoEstado} no existe en task_states`);
    }

    // Obtener estado actual antes de actualizar
    const [rows] = await conn.query(
      "SELECT state_id, assigned_to FROM tasks WHERE id = ?",
      [id]
    );
    const tarea = rows[0];
    if (!tarea) throw new Error("Tarea no encontrada");

    // Actualizar estado
    await conn.query("UPDATE tasks SET state_id = ? WHERE id = ?", [
      nuevoEstado,
      id,
    ]);

    // Guardar en historial
    await conn.query(
      `INSERT INTO task_history 
       (task_id, actor_id, prev_state_id, new_state_id, prev_assigned_to, new_assigned_to) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, actorId, tarea.state_id, nuevoEstado, tarea.assigned_to, tarea.assigned_to]
    );

    await conn.commit();
    console.log("Estado actualizado correctamente en DB");

  } catch (error) {
    await conn.rollback();
    console.error("Error en actualizarEstadoTarea:", error);
    throw error;
  } finally {
    conn.release();
  }
};

// Asignar responsable a una tarea y guardar en historial
export const asignarResponsable = async (id, nuevoResponsable, actorId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Obtener datos actuales
    const [rows] = await conn.query(
      "SELECT state_id, assigned_to FROM tasks WHERE id = ?",
      [id]
    );
    const tarea = rows[0];
    if (!tarea) throw new Error("Tarea no encontrada");

    // Actualizar responsable
    await conn.query("UPDATE tasks SET assigned_to = ? WHERE id = ?", [
      nuevoResponsable,
      id,
    ]);

    // Guardar en historial
    await conn.query(
      `INSERT INTO task_history 
       (task_id, actor_id, prev_state_id, new_state_id, prev_assigned_to, new_assigned_to) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, actorId, tarea.state_id, tarea.state_id, tarea.assigned_to, nuevoResponsable]
    );

    await conn.commit();
    console.log("Responsable actualizado correctamente en DB");
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

    // Validar que la prioridad existe
    const [prioRows] = await conn.query(
      "SELECT id FROM task_types WHERE id = ?",
      [nuevaPrioridad]
    );
    if (prioRows.length === 0) {
      throw new Error(`La prioridad ${nuevaPrioridad} no existe en task_priorities`);
    }

    // Obtener datos actuales
    const [rows] = await conn.query(
      "SELECT type_id FROM tasks WHERE id = ?",
      [id]
    );
    const tarea = rows[0];
    if (!tarea) throw new Error("Tarea no encontrada");

    // Actualizar prioridad
    await conn.query("UPDATE tasks SET type_id = ? WHERE id = ?", [
      nuevaPrioridad,
      id,
    ]);

    // Guardar en historial (opcional)
    await conn.query(
      `INSERT INTO task_history 
       (task_id, actor_id, prev_state_id, new_state_id, prev_assigned_to, new_assigned_to) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, actorId, tarea.type_id, nuevaPrioridad, null, null]
    );

    await conn.commit();
    console.log("✅ Prioridad actualizada correctamente en DB");

  } catch (error) {
    await conn.rollback();
    console.error("Error en actualizarPrioridadTarea:", error);
    throw error;
  } finally {
    conn.release();
  }
};
