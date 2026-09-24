import { NavLink } from "react-router";
import { User, FileText, ShoppingCart, Settings } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";

// Each nav item: the label, icon, and the route it links to.
// "end: true" on the Profile link means it only counts as active on an
// EXACT match of /account, not on /account/posts etc. too.
const navItems = [
  { label: "Profile", icon: User, to: "/account", end: true },
  { label: "My Posts", icon: FileText, to: "/account/posts" },
  { label: "My Claims", icon: ShoppingCart, to: "/account/claims" },
];

const AccountSidebar = () => {
  const { data: user, isLoading, isError } = useProfile();

  // Temporary fallback while profile is loading
  const fullName =
    user?.firstName || user?.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : "User";

  return (
    <aside className="w-full max-w-xs">
      {/* ================= USER INFO ================= */}
      <div className="flex items-center gap-3">
        {/* Profile Image */}
        {user?.profileUrl ? (
          <img
            src={user.profileUrl}
            alt={`${fullName}'s profile`}
            className="w-15 h-15 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-15 h-15 rounded-full bg-neutral-300 shrink-0 flex items-center justify-center text-xl font-bold text-white uppercase">
            {fullName.charAt(0)}
          </div>
        )}

        {/* User Information */}
        <div className="min-w-0">
          <p className="text-heading-3 font-bold text-text-primary break-words">
            {isLoading ? "Loading..." : fullName}
          </p>

          <p className="text-body-sm text-text-secondary break-words">
            {isError ? "Unable to load profile" : user?.email}
          </p>
        </div>
      </div>

      {/* ================= NAV LINKS ================= */}
      <nav className="mt-8 space-y-3">
        {navItems.map(({ label, icon: Icon, to, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 border rounded-lg px-4 py-3 text-body-md transition-colors ${
                isActive
                  ? "bg-primary text-text-inverse border-primary"
                  : "border-border text-text-primary hover:bg-background-subtle"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        {/* Settings */}
        <NavLink
          to="/account/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 border rounded-lg px-4 py-3 text-body-md transition-colors ${
              isActive
                ? "bg-primary text-text-inverse border-primary"
                : "border-border text-text-primary hover:bg-background-subtle"
            }`
          }
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
