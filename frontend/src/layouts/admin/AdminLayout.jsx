import { Outlet } from "react-router";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useProfile } from "../../hooks/useProfile";

const AdminLayout = () => {
  const { data: admin, isLoading } = useProfile();

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-subtle">
      <AdminSidebar
        name={admin ? `${admin.firstName} ${admin.lastName}` : "Admin"}
        role={admin?.role ?? "ADMIN"}
      />

      <main className="flex-1 h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
