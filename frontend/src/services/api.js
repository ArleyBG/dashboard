// src/services/api.js
// Lee la URL del backend desde env. En local, cae a http://localhost:8080/api
const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol === "https:" ? "https" : "http"}://localhost:${import.meta.env.VITE_API_PORT || "8080"}/api`;

// Helper para peticiones
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      // Si tu backend está en otro dominio, CORS debe estar permitido (ya lo tienes)
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const ct = res.headers.get("content-type") || "";
    let data;
    if (ct.includes("application/json")) {
      data = await res.json();
    } else {
      data = { message: await res.text() };
    }

    return { ok: res.ok, ...data };
  } catch (err) {
    console.error("Error en request:", err);
    return { ok: false, message: "Error en la comunicación con el servidor" };
  }
};

// —— Auth ——
export const loginRequest = ({ email, password }) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerRequest = ({ cedula, name, email, role_id, password }) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ cedula, name, email, role_id, password }),
  });

export const getProfile = () => {
  const token = localStorage.getItem("token");
  return request("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// —— Tareas ——
export const getTasks = () => {
  const token = localStorage.getItem("token");
  return request("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTask = (taskData) => {
  const token = localStorage.getItem("token");
  return request("/tasks", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(taskData),
  });
};

export const updateTaskState = (taskId, nuevoEstado) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/estado`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nuevoEstado: Number(nuevoEstado) }),
  });
};

export const getUsers = () => {
  const token = localStorage.getItem("token");
  return request("/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateTaskResponsable = (taskId, assigned_to) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/responsable`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ assigned_to }),
  });
};

export const updateTaskPriority = (taskId, nuevaPrioridad) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/prioridad`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nuevaPrioridad: Number(nuevaPrioridad) }),
  });
};

export { API_URL };
