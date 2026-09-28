import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useProfile } from "../hooks/useProfile";

// Wraps admin routes: redirects non-admins (and guests) to Home.
const AdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: user, isLoading } = useProfile();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (isLoading) return <div className="p-10">Loading...</div>;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
