import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles, children }) => {
  const { auth } = useAuth();
  console.log(auth);
  if (!auth.token) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.includes(auth.user?.rol)) {
    return <Navigate to="/dashboard" />; // Redirigir a dashboard si el rol no coincide
  }

  return children;
};

export default ProtectedRoute;
