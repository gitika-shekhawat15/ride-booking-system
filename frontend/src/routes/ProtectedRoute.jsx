import { Navigate } from "react-router-dom";
import { getDecodedToken } from "../utils/token";

function ProtectedRoute({ children, requiredRole }) {
  const decoded = getDecodedToken();

  if (!decoded) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && decoded.role !== requiredRole) {
    if (decoded.role === "driver") return <Navigate to="/driver/home" />;
    if (decoded.role === "rider") return <Navigate to="/home" />;
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;