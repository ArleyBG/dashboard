import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../services/api.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cedula: "",
    name: "",
    email: "",
    role_id: "",
    password: "",
    password2: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const roleMap = {
    admin: 1,
    t1: 2,
    t2: 3
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    // Validaciones de los campos
    if (!form.cedula || !form.name || !form.email || !form.role_id || !form.password) {
      setErrors("Completa todos los campos obligatorios");
      return;
    }

    if (form.password !== form.password2) {
      setErrors("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        role_id: roleMap[form.role_id]
      };

      const res = await registerRequest(payload); // Espera respuesta del backend
      setLoading(false);

      if (res.ok) {
        alert("Registro exitoso");
        navigate("/");
      } else {
        setErrors(res.message || "Error en el registro");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error en el registro", error)
      setErrors("Error en la comunicación con el servidor");
    }
  };

  return (
    <div className="mt-20 max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-center text-xl text-black font-bold mb-4">Registrarse</h2>

      {errors && <div className="text-red-600 mb-3">{errors}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={form.cedula}
          onChange={(e) => setForm({ ...form, cedula: e.target.value })}
          type="number"
          placeholder="Cédula de ciudadanía"
          className="p-2 border rounded"
          required
        />

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          type="text"
          placeholder="Nombre completo"
          className="p-2 border rounded"
          required
        />

        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          placeholder="Correo electrónico"
          className="p-2 border rounded"
          required
        />

        <select
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          className="w-[200px] p-2 border rounded"
          required
        >
          <option value="">Selecciona tu cargo</option>
          <option value="t1">T1</option>
          <option value="t2">T2</option>
        </select>

        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Contraseña"
          className="p-2 border rounded"
          required
        />

        <input
          value={form.password2}
          onChange={(e) => setForm({ ...form, password2: e.target.value })}
          type="password"
          placeholder="Repetir contraseña"
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-black">
        Si ya estas registrado,{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          Inicia sesion aquí
        </Link>
      </p>
    </div>
  );
}
