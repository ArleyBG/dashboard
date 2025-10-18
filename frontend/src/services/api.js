// src/services/api.js

// ——— Base URL robusta ———
// Soporta VITE_API_URL con o sin "/api" y sin barras duplicadas.
// Ejemplos:
//   VITE_API_URL=https://tu-backend.railway.app
//   VITE_API_URL=https://tu-backend.railway.app/api
const envUrl = (import.meta.env?.VITE_API_URL || "").trim();
const fromEnv = envUrl ? envUrl.replace(/\/+$/, "") : ""; // quita barras finales
let BASE = fromEnv;

// Fallback local si no hay env
if (!BASE) {
  const proto = window.location.protocol.startsWith("https") ? "https" : "http";
  const port = import.meta.env?.VITE_API_PORT || "8080";
  BASE = `${proto}://localhost:${port}`;
}

// Asegura que termine en /api (una sola vez)
if (!/\/api$/.test(BASE)) BASE = `${BASE}/api`;

// Construye URL final sin dobles barras
const makeUrl = (endpoint = "") => {
  const ep = `${endpoint}`.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${BASE}${ep}`;
};

// ——— Helper de request ———
const request = async (endpoint, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const opts = {
      mode: "cors",
      ...options,
      headers,
    };

    // Asegura body serializado si es objeto
    if (opts.body && typeof opts.body !== "string") {
      opts.body = JSON.stringify(opts.body);
    }

    const res = await fetch(makeUrl(endpoint), opts);

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

// ——— Auth ———
export const loginRequest = ({ email, password }) =>
  request("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const registerRequest = ({ cedula, name, email, role_id, password }) =>
  request("/auth/register", {
    method: "POST",
    body: { cedula, name, email, role_id, password },
  });

export const getProfile = () => {
  const token = localStorage.getItem("token");
  return request("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ——— Tareas ———
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
    body: taskData || {}, // ← ya se serializa en request()
  });
};

export const updateTaskState = (taskId, nuevoEstado) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/estado`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: { nuevoEstado: Number(nuevoEstado) },
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
    body: { assigned_to }, // puede ser número o null
  });
};

export const updateTaskPriority = (taskId, nuevaPrioridad) => {
  const token = localStorage.getItem("token");
  return request(`/tasks/${taskId}/prioridad`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: { nuevaPrioridad: Number(nuevaPrioridad) },
  });
};

export { BASE as API_URL };
