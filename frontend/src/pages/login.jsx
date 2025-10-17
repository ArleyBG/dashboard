import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginRequest } from "../services/api.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Mapeo de rol_id numérico a rutas
  const roleRoutes = {
    1: "/dashboard-admin",
    2: "/dashboard-t1",
    3: "/dashboard-t2",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!form.email || !form.password) {
      setErrors("Por favor ingresa tu correo y contraseña");
      return;
    }

    try {
      setLoading(true);
      const res = await loginRequest(form);
      console.log("Respuesta del login:", res);
      setLoading(false);

      if (res.token) {
        // Guardar token en localStorage
        localStorage.setItem("token", res.token);

        // Redirigir según rol
        const roleId = res.user?.role_id;
        const route = roleRoutes[roleId];
        
        if (route) {
          navigate(route);
        } else {
          setErrors("Rol no reconocido");
        }
      } else {
        setErrors(res.message || "Error en login");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error en login:", error);
      setErrors("Error en la comunicación con el servidor");
    }
  };

  return (
    <div className="mt-20 max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-center text-xl font-bold mb-4 text-black">Iniciar sesión</h2>

      {errors && <div className="text-red-600 mb-3">{errors}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-black">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Registrarme
        </Link>
      </p>
    </div>
  );
}
