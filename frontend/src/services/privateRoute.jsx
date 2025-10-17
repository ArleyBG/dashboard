import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import AccessDeniedModal from "../components/alert";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [decoded, setDecoded] = useState(null);

  const roleHome = useMemo(
    () => ({
      1: "/dashboard-admin",
      2: "/dashboard-t1",
      3: "/dashboard-t2",
    }),
    []
  );

  const roleRoutes = useMemo(
    () => ({
      1: ["/dashboard-admin", "/dashboard-t1", "/dashboard-t2"],
      2: ["/dashboard-t1"],
      3: ["/dashboard-t2"],
    }),
    []
  );

  // validar token una sola vez
  useEffect(() => {
    if (!token) {
      setDecoded(null);
      setChecked(true);
      return;
    }

    try {
      const dec = jwtDecode(token);
      const now = Date.now() / 1000;
      if (!dec.exp || dec.exp < now) {
        localStorage.removeItem("token");
        setDecoded(null);
      } else {
        setDecoded(dec);
      }
    } catch {
      localStorage.removeItem("token");
      setDecoded(null);
    } finally {
      setChecked(true);
    }
  }, [token]);

  // validar acceso según rol y ruta
  useEffect(() => {
    if (!decoded) return;
    const allowedList = roleRoutes[decoded.role_id] || [];
    const path = location.pathname.replace(/\/+$/, "");
    const allowed = allowedList.some(
      (r) => path === r || path.startsWith(r + "/")
    );
    setIsAllowed(allowed);
    setShowModal(!allowed);
  }, [location.pathname, decoded, roleRoutes]);

  // Espera hasta tener validación lista
  if (!checked) return null;

  // Sin token → al login
  if (!token || !decoded) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Acceso denegado → muestra modal y no renderiza el Outlet
  if (!isAllowed) {
    const fallback = roleHome[decoded.role_id] || "/";
    return (
      <>
        {showModal && (
          <AccessDeniedModal
            message="No tienes acceso a este tablero."
            onClose={() => {
              setShowModal(false);
              navigate(fallback, { replace: true });
            }}
          />
        )}
      </>
    );
  }

  // Acceso permitido
  return <Outlet />;
}
