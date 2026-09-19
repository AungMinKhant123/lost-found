import { NavLink } from "react-router";
import { User, FileText, ShoppingCart, Settings } from "lucide-react";

// Each nav item: the label, icon, and the route it links to.
// "end: true" on the Profile link means it only counts as active on an
// EXACT match of /account, not on /account/posts etc. too.
const navItems = [
  { label: "Profile", icon: User, to: "/account", end: true },
  { label: "My Posts", icon: FileText, to: "/account/posts" },
  { label: "My Claims", icon: ShoppingCart, to: "/account/claims" },
];

const AccountSidebar = ({
  // Defaults only used briefly during the loading state in AccountLayout —
  // real values are always passed in once the user data has loaded.
  name = "David",
  email = "myolwin400400@gmail.com",
}) => {
  return (
    <aside className="w-full max-w-xs">
      {/* User info */}
      <div className="flex items-center gap-3">
        {/* Avatar placeholder — swap for the real profile photo later */}
        <div className="w-14 h-14 rounded-full bg-neutral-300 shrink-0" />

        {/* min-w-0 lets this text container actually shrink/wrap inside
            the flex row instead of overflowing past the sidebar's edge —
            without it, a long name (e.g. "Ashfaq Ifthicar") can visually
            spill outside its bounds since flex items don't shrink below
            their content size by default. */}
        <div className="min-w-0">
          <p className="text-heading-3 font-bold text-text-primary break-words">
            {name}
          </p>
          <p className="text-body-sm text-text-secondary break-words">
            {email}
          </p>
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

        {/* Logout button removed per UI/UX — logging out now happens
            exclusively from the Navbar's profile dropdown. */}

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
