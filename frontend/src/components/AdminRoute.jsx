import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useProfile } from "../hooks/useProfile";

// Wraps admin routes: only ADMIN and SUPERADMIN can access the admin UI.
const AdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: user, isLoading } = useProfile();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
