import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import TaskTable from "../components/TaskTable";
import TaskSearch from "../components/TaskSearch";
import { getTasks, updateTaskState } from "../services/api";

export default function T1() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(null);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const res = await getTasks();
    if (res.ok) setTasks(res.tareas);
  };

  const handleUpdateState = async (taskId, nuevoEstado) => {
    const res = await updateTaskState(taskId, nuevoEstado);
    if (res.ok) loadTasks();
  };

  // Visibles para T1: solo tareas con assigned_role = 2
  const visibleTasks = useMemo(
    () => (tasks || []).filter(t => Number(t.assigned_role) === 2),
    [tasks]
  );

  const { compromisos, implementacion, qa, finalizado } = useMemo(
    () => ({
      compromisos: visibleTasks.filter(t => t.state_id === 1),
      implementacion: visibleTasks.filter(t => t.state_id === 2),
      qa:           visibleTasks.filter(t => t.state_id === 3),
      finalizado:   visibleTasks.filter(t => t.state_id === 4),
    }),
    [visibleTasks]
  );

  return (
    <div className="flex">
      <Sidebar role={2} />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-12 text-center">Panel T1</h2>

        {/* Buscador sobre lo que T1 puede ver */}
        <TaskSearch tasks={visibleTasks} onFilter={setFilteredTasks} />

        {filteredTasks ? (
          <TaskTable tasks={filteredTasks} onUpdate={handleUpdateState} onReload={loadTasks} />
        ) : (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-2">Compromiso</h3>
            <TaskTable tasks={compromisos} onUpdate={handleUpdateState} onReload={loadTasks} />

            <h3 className="text-xl font-semibold mt-6 mb-2">Implementación</h3>
            <TaskTable tasks={implementacion} onUpdate={handleUpdateState} onReload={loadTasks} />

            <h3 className="text-xl font-semibold mt-6 mb-2">QA</h3>
            <TaskTable tasks={qa} onUpdate={handleUpdateState} onReload={loadTasks} />

            <h3 className="text-xl font-semibold mt-6 mb-2">Finalizado</h3>
            <TaskTable tasks={finalizado} onUpdate={handleUpdateState} onReload={loadTasks} />
          </>
        )}
      </div>
    </div>
  );
}
