import { NavLink } from "react-router-dom";

export default function Sidebar({ onCreate, role }) {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen flex flex-col p-4">
      {/* Encabezado y navegación */}
      <div>
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/dashboard-admin"
                className={({ isActive }) =>
                  isActive ? "font-bold text-blue-400" : ""
                }
              >
                Admin
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard-t1"
                className={({ isActive }) =>
                  isActive ? "font-bold text-blue-400" : ""
                }
              >
                Operación T1
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard-t2"
                className={({ isActive }) =>
                  isActive ? "font-bold text-blue-400" : ""
                }
              >
                Operación T2
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Botón centrado solo para el admin */}
      {role === 1 && (
        <div className="flex mt-12">
          <button
            onClick={onCreate}
            aria-label="Crear nueva tarea"
            className="w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear Tarea
          </button>
        </div>
      )}
    </aside>
  );
}
