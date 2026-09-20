import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AccountSidebar from "../../components/user/AccountSidebar";
import { getCurrentUser } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import DecorativeBackground from "../../components/DecorativeBackground/DecorativeBackground";

const AccountLayout = () => {
  // Holds the fetched current user (name, email, etc.) for the Sidebar.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Watches the actual logged-in user's id from the auth store. This is
  // the key fix: including authUserId in the effect's dependency array
  // below means "re-fetch whenever WHO is logged in changes" — covering
  // a real login, the dev-only mock switcher, or logging out and back
  // in as someone else. Previously this effect only ran once on mount
  // and never again, which is why switching mock users didn't update
  // the sidebar.
  const authUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to load current user:", err))
      .finally(() => setLoading(false));
  }, [authUserId]);

  return (
    // relative + overflow-hidden: this is what lets the circles inside
    // DecorativeBackground bleed off the container's edges (via negative
    // left/right offsets in designs.js) while getting clipped cleanly at
    // the container's actual boundary, instead of spilling further out
    // and affecting the rest of the page's layout.
    <div className="max-w-[1280px] mx-auto px-10 py-10 relative">
      <DecorativeBackground variant="account" />

      {/* relative + z-10: lifts all real page content above the circles
          (which sit at z-0), so the sidebar/pages are never visually
          covered by them. */}
      <div className="flex gap-8 items-start relative z-10">
        {loading ? (
          <div className="w-full max-w-xs text-body-sm text-text-secondary">
            Loading...
          </div>
        ) : (
          <AccountSidebar
            name={user ? `${user.firstName} ${user.lastName}` : undefined}
            email={user?.email}
          />
        )}
        <div className="flex-1 min-h-[600px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
