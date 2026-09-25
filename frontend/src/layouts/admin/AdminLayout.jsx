import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getCurrentUser } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

const AdminLayout = () => {
  const [admin, setAdmin] = useState(null);
  const authUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    getCurrentUser().then((user) => setAdmin(user));
  }, [authUserId]);

  return (
    <div className="flex min-h-screen bg-background-subtle">
      <AdminSidebar
        name={admin ? `${admin.firstName}` : "Admin"}
        role="Admin"
      />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
