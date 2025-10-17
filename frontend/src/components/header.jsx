import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HeaderIcon from "../assets/logo-monda.png";

export const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [darkMode, setDarkMode] = useState(false);

  // Aplica tema guardado al montar
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved ? saved === "dark" : prefersDark;

    document.documentElement.classList.toggle("theme-dark", useDark);
    setDarkMode(useDark);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("theme-dark", next);
  };

  return (
    <header className="
      flex justify-between items-center
      px-6 py-3
      bg-[rgb(var(--header-bg))] text-[rgb(var(--header-fg))]
    ">
      <div className="flex items-center gap-4">
        <figure>
          <img src={HeaderIcon} alt="Logo Monda" className="h-16" />
        </figure>
        <h1 className="font-bold text-3xl">Monda</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="
            px-4 py-2 rounded hover:opacity-80
            bg-[rgb(var(--surface))] text-[rgb(var(--fg))]
            border border-[rgb(var(--border))]
          "
        >
          {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
        </button>

        {token && (
          <button
            onClick={handleLogout}
            className="
              px-4 py-2 rounded
              bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))]
              hover:opacity-90
            "
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
};
