import { NavLink } from "react-router-dom";

export default function Sidebar({ onCreate, role }) {
  return (
    <aside className="w-64 h-screen flex flex-col p-4 bg-[rgb(var(--surface))] text-[rgb(var(--fg))] border-r border-[rgb(var(--border))]">
      <div>
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/dashboard-admin"
                className={({ isActive }) =>
                  isActive ? "font-bold text-[rgb(var(--primary))]" : ""
                }
              >
                Admin
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard-t1"
                className={({ isActive }) =>
                  isActive ? "font-bold text-[rgb(var(--primary))]" : ""
                }
              >
                Operación T1
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard-t2"
                className={({ isActive }) =>
                  isActive ? "font-bold text-[rgb(var(--primary))]" : ""
                }
              >
                Operación T2
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {role === 1 && (
        <div className="flex mt-12">
          <button
            onClick={onCreate}
            aria-label="Crear nueva tarea"
            className="w-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] px-4 py-2 rounded hover:opacity-90"
          >
            Crear Tarea
          </button>
        </div>
      )}
    </aside>
  );
}
