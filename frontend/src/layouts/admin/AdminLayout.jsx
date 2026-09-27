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
    // h-screen + overflow-hidden on the OUTER container is what prevents
    // the whole page (including the sidebar) from ever scrolling.
    <div className="flex h-screen overflow-hidden bg-background-subtle">
      <AdminSidebar
        name={admin ? `${admin.firstName} ${admin.lastName}` : "Admin"}
        role="Admin"
      />
      {/* overflow-y-auto + h-full on just the content area is what lets
          THIS scroll independently, while the sidebar (a separate flex
          sibling) stays completely fixed regardless of content height. */}
      <main className="flex-1 h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
