import { useState, useEffect } from "react";
import { getUsers } from "../services/api";

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    assigned_role: "", 
    type_id: "",
    end_date: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await getUsers();
      if (res.ok) setUsers(res.users || []);
    };
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia el usuario y tiene role_id, autollenamos assigned_role
    if (name === "assigned_to") {
      const selected = users.find(u => String(u.id) === String(value));
      if (selected?.role_id) {
        setForm(prev => ({
          ...prev,
          assigned_to: value,
          assigned_role: String(selected.role_id), // usualmente 2 o 3
        }));
        return;
      }
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      type_id: Number(form.type_id),
      assigned_to: Number(form.assigned_to),
      assigned_role: form.assigned_role ? Number(form.assigned_role) : null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="m-auto space-y-3 p-4 border rounded w-[60%]">

      <input
        name="title"
        placeholder="Título"
        value={form.title}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <select
        name="type_id"
        value={form.type_id}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Selecciona prioridad</option>
        <option value={1}>Baja</option>
        <option value={2}>Alta</option>
        <option value={3}>Crítica</option>
      </select>

      {/* Asignar a usuario */}
      <select
        name="assigned_to"
        value={form.assigned_to}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Asignar a usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} {user.role_id ? `(rol ${user.role_id})` : ""}
          </option>
        ))}
      </select>

      {/* Asignar por rol (T1 o T2). Si el autollenado ya lo puso, igual puede editarse */}
      <select
        name="assigned_role"
        value={form.assigned_role}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Asignar por rol</option>
        <option value={2}>T1</option>
        <option value={3}>T2</option>
      </select>

      <input
        type="date"
        name="end_date"
        value={form.end_date}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
        Crear
      </button>
    </form>
  );
}
