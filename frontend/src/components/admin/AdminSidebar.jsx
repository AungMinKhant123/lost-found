import { NavLink } from "react-router";
import { LayoutGrid, List, SlidersHorizontal, UserCog } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, to: "/admin", end: true },
  { label: "Manage Listings", icon: List, to: "/admin/listings" },
  {
    label: "Manage Attributes",
    icon: SlidersHorizontal,
    to: "/admin/attributes",
  },
  { label: "Profile/Account", icon: UserCog, to: "/admin/profile" },
];

const AdminSidebar = ({ name = "Admin", role = "Admin" }) => {
  return (
    <aside className="w-64 h-full bg-[#1B1533] flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <img
          src="https://res.cloudinary.com/d5tnusci/image/upload/v1789382451/signup2_bzibei.png"
          alt=""
          className="w-8 h-auto"
        />
        <span className="text-white font-bold text-xl">
          Lost<span className="text-primary">Found</span>
        </span>
      </div>

      {/* Nav */}
      <div className="px-4 mt-4 flex-1">
        <p className="text-label-sm font-semibold text-primary tracking-wide px-2 mb-3">
          ADMIN PANEL
        </p>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, to, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-body-md transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Admin user footer */}
      <div className="flex items-center gap-3 px-6 py-6 border-t border-white/10">
        <div className="w-10 h-10 rounded-full bg-neutral-300 shrink-0" />
        <div>
          <p className="text-body-md font-bold text-white">{name}</p>
          <p className="text-label-sm text-primary">{role}</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
