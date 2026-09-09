import { NavLink } from "react-router";
import { User, FileText, ShoppingCart, LogOut, Settings } from "lucide-react";

// Each nav item: the label, icon, and the route it links to.
// "end: true" on the Profile link means it only counts as active on an
// EXACT match of /account, not on /account/posts etc. too.
const navItems = [
  { label: "Profile", icon: User, to: "/account", end: true },
  { label: "My Posts", icon: FileText, to: "/account/posts" },
  { label: "My Claims", icon: ShoppingCart, to: "/account/claims" },
];

const AccountSidebar = ({
  // These will come from real auth/user data later — hardcoded defaults for now.
  name = "David",
  email = "myolwin400400@gmail.com",
  onLogout,
}) => {
  return (
    <aside className="w-full max-w-xs">
      {/* User info */}
      <div className="flex items-center gap-3">
        {/* Avatar placeholder — swap for the real profile photo later */}
        <div className="w-14 h-14 rounded-full bg-neutral-300 shrink-0" />
        <div>
          <p className="text-heading-3 font-bold text-text-primary">{name}</p>
          <p className="text-body-sm text-text-secondary">{email}</p>
        </div>
      </div>

      {/* Nav links */}
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

        {/* Logout isn't a route — it's an action, so it's a button, not a NavLink.
            The actual logout logic (clearing auth state/token) will be wired up
            once real authentication exists; for now it just calls whatever
            function the parent passes in via onLogout. */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-body-md text-text-primary hover:bg-background-subtle transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>

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
