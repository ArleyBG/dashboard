import { useEffect, useState } from "react";
import { getUsers, updateTaskResponsable, updateTaskPriority } from "../services/api";

export default function TaskTable({ tasks = [], onUpdate, onReload }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await getUsers();
      if (res.ok) setUsers(res.users);
    };
    loadUsers();
  }, []);

  if (!Array.isArray(tasks)) return null;

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    const [year, month, day] = isoString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const selectCls = "border p-1 rounded bg-[rgb(var(--card))] text-[rgb(var(--fg))] border-[rgb(var(--border))]";

  return (
    <table className="w-full border-collapse border border-[rgb(var(--border))]">
      <thead>
        <tr className="bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))]">
          <th className="border p-2">ID</th>
          <th className="border p-2">Elemento</th>
          <th className="border p-2">Estado</th>
          <th className="border p-2">Responsable</th>
          <th className="border p-2">Descripción</th>
          <th className="border p-2">Admin</th>
          <th className="border p-2">Prioridad</th>
          <th className="border p-2">Fecha fin</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="border p-2">{task.id}</td>
            <td className="border p-2 font-bold">{task.title}</td>

            {/* Estado */}
            <td className="border p-2">
              <select
                value={task.state_id}
                onChange={(e) => onUpdate(task.id, Number(e.target.value))}
                className={selectCls}
              >
                <option value={1}>Compromiso</option>
                <option value={2}>Implementación</option>
                <option value={3}>QA</option>
                <option value={4}>Finalizado</option>
              </select>
            </td>

            {/* Responsable */}
            <td className="border p-2">
              <select
                value={task.assigned_to ?? ""}
                onChange={async (e) => {
                  const v = e.target.value;
                  const payload = v === "" ? null : Number(v);
                  const res = await updateTaskResponsable(task.id, payload);
                  if (res.ok && onReload) onReload();
                }}
                className={selectCls}
              >
                <option value="">—</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </td>

            <td className="border p-2">{task.description}</td>
            <td className="border p-2">{task.created_by_name || "—"}</td>

            {/* Prioridad */}
            <td className="border p-2">
              <select
                value={task.type_id}
                onChange={async (e) => {
                  const res = await updateTaskPriority(task.id, Number(e.target.value));
                  if (res.ok && onReload) onReload();
                }}
                className={selectCls}
              >
                <option value={1}>Baja</option>
                <option value={2}>Alta</option>
                <option value={3}>Crítica</option>
              </select>
            </td>

            <td className="border p-2">{formatDate(task.end_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
