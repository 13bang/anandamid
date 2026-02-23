import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/ayamgoreng/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.clear();
      return <Navigate to="/ayamgoreng/login" replace />;
    }
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/ayamgoreng/login" replace />;
  }

  return <Outlet />;
}