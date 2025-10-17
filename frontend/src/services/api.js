export const API_URL = "http://localhost:3000/api";

// Helper para hacer peticiones al backend
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const contentType = res.headers.get("content-type");
    let data = {};
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = { message: await res.text() };
    }

    return { ok: res.ok, ...data };
  } catch (error) {
    console.error("Error en request:", error);
    return { ok: false, message: "Error en la comunicación con el servidor" };
  }
};

// Login
export const loginRequest = async ({ email, password }) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// Registro
export const registerRequest = async ({ cedula, name, email, role_id, password }) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      cedula,   // se guarda como id en DB
      name,
      email,
      role_id,
      password,
    }),
  });
};

// Obtener perfil del usuario logueado
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  return request("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Listar tareas (admin ve todas, T1/T2 solo las suyas)
export const getTasks = async () => {
  const token = localStorage.getItem("token");
  return request("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Crear nueva tarea (solo admin)
export const createTask = async (taskData) => {
  const token = localStorage.getItem("token");
  return request("/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(taskData),
  });
};

// Actualizar estado de una tarea
export const updateTaskState = async (taskId, nuevoEstado) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/estado`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nuevoEstado: Number(nuevoEstado) }), 
  });
};

// Obtener Usuarios en la DB
export const getUsers = async () => {
  const token = localStorage.getItem("token");
  return request("/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Asignar responsable de una tarea
export const updateTaskResponsable = async (taskId, assigned_to) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/responsable`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assigned_to }),
  });
};

// Actualizar prioridad de una tarea
export const updateTaskPriority = async (taskId, nuevaPrioridad) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/prioridad`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nuevaPrioridad: Number(nuevaPrioridad) }),
  });
};