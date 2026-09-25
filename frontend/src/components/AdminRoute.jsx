import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getCurrentUser } from "../services/api";

// Wraps admin routes: redirects non-admins (and guests) to Home,
// instead of letting them see the admin dashboard just by knowing the URL.
const AdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authUserId = useAuthStore((state) => state.user?.id);
  const [isAdmin, setIsAdmin] = useState(null); // null = still checking

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }
    getCurrentUser().then((user) => setIsAdmin(user.role === "admin"));
  }, [isAuthenticated, authUserId]);

  if (isAdmin === null) return <div className="p-10">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
