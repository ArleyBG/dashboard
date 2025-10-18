import { useState } from "react";

export default function TaskSearch({ tasks, onFilter }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value.trim() === "") {
      onFilter(null);
      return;
    }

    const filtered = tasks.filter((task) => {
      return (
        task.id.toString().includes(value) ||
        (task.title && task.title.toLowerCase().includes(value)) ||
        (task.created_by_name && task.created_by_name.toLowerCase().includes(value)) ||
        (task.priority_name && task.priority_name.toLowerCase().includes(value)) ||
        (task.end_date && task.end_date.toLowerCase().includes(value))
      );
    });

    onFilter(filtered);
  };

  return (
    <div className="mb-4 flex justify-center">
      <input
        type="text"
        placeholder="Buscar por ID, nombre, rol, fecha o prioridad..."
        value={query}
        onChange={handleSearch}
        className="
          w-[60%] p-2 rounded border
          bg-[rgb(var(--card))] text-[rgb(var(--fg))]
          border-[rgb(var(--border))]
          placeholder:text-[rgba(var(--fg),0.6)]
        "
      />
    </div>
  );
}
