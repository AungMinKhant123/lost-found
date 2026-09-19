import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

// Wraps any route that requires the user to be logged in. If they're
// not, redirects straight to /login instead of rendering the page
// underneath. Reads from the SAME auth store the Navbar/mock switcher/
// real login all use — one single source of truth for "is someone
// logged in," so this guard automatically works correctly whether the
// login was real or the dev-only mock switcher.
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
