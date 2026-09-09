import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AccountSidebar from "../../components/user/AccountSidebar";
import { getCurrentUser } from "../../services/api";

const AccountLayout = () => {
  // Holds the fetched current user (name, email, etc.) for the Sidebar.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to load current user:", err))
      .finally(() => setLoading(false));
  }, []);

  // Placeholder logout handler — replace with real auth logout later
  // (clearing token/session, redirecting to /login, etc.)
  const handleLogout = () => {
    console.log("Logout clicked — wire up real auth logic here.");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-10 py-10">
      <div className="flex gap-8 items-start">
        {loading ? (
          <div className="w-full max-w-xs text-body-sm text-text-secondary">
            Loading...
          </div>
        ) : (
          <AccountSidebar
            name={user ? `${user.firstName} ${user.lastName}` : undefined}
            email={user?.email}
            onLogout={handleLogout}
          />
        )}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
