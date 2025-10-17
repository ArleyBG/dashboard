import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TaskForm from "../components/FormTask";
import { createTask } from "../services/api";

export default function Admin() {
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data) => {
    const res = await createTask(data);
    if (res.ok) {
      setShowForm(false);
      // Opcional: algún toast de éxito
    }
  };

  return (
    <div className="flex">
      <Sidebar onCreate={() => setShowForm(true)} role={1} />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-12 text-center">Panel Admin</h2>

        {showForm && <TaskForm onSubmit={handleCreate} />}
      </div>
    </div>
  );
}
