import { Link, NavLink, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, LayoutGrid, Menu, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "../../api/authApi";
import { useProfile } from "../../hooks/useProfile";
import { useAuthStore } from "../../store/authStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Item List", href: "/item-list" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About Us", href: "/about-us" },
];

const UserHeader = () => {
  // Authentication state comes from Zustand.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const logout = useAuthStore((state) => state.logout);

  // Profile information comes from TanStack Query.
  const { data: user } = useProfile();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Controls whether the Profile dropdown is open.
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // Always clear local auth state and navigate away, regardless of
    // whether the backend logout call succeeds. A failed network request
    // should never leave the user stuck "logged in" on their own device —
    // the backend call is a best-effort cleanup (e.g. invalidating a
    // server-side session), not a requirement for the local logout to work.
    try {
      await logoutUser();
    } catch (error) {
      console.error(
        "Backend logout call failed (logging out locally anyway):",
        error,
      );
    } finally {
      logout();

      queryClient.removeQueries({
        queryKey: ["profile"],
      });

      setIsDropdownOpen(false);
      navigate("/login");
    }
  };

  const fullName =
    user?.firstName || user?.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : "User";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-background-subtle border-b border-border px-4 md:px-10 py-3 ">
      <div className="flex items-center justify-between pb-2 md:pb-0 pt-3 md:pt-0 ">
        {/* ================= LOGO ================= */}
        <Link to="/">
          <div className="flex justify-center items-center gap-2">
            <img
              src="https://res.cloudinary.com/d5tnusci/image/upload/v1789382451/signup2_bzibei.png"
              alt=""
              className="w-10 md:w-15 h-auto"
            />

            <div className="flex gap-1">
              <h1 className="font-bold text-xl md:text-2xl">Lost</h1>
              <h1 className="text-primary font-bold text-xl md:text-2xl">
                Found
              </h1>
            </div>
          </div>
        </Link>

        {/* ================= NAV LINKS ================= */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `relative pb-1 text-body-md transition-colors ${
                  isActive
                    ? "text-primary after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-text-primary hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ================= AUTH ACTIONS ================= */}
        <div className="flex items-center gap-2 md:gap-6">
          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-text-primary"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* New Post */}
          <Link
            to={isAuthenticated ? "/account/new-post" : "/login"}
            className="hidden md:block bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-3 md:px-6 py-2 md:py-3 text-label-lg font-medium transition-colors whitespace-nowrap"
          >
            New Post
          </Link>

          {isAuthenticated ? (
            /* ================= LOGGED-IN STATE ================= */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="w-11 h-11 rounded-full overflow-hidden border border-border shrink-0"
              >
                {/* Profile Image */}
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={`${fullName}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Fallback Avatar */
                  <div className="w-full h-full bg-neutral-300 flex items-center justify-center text-text-secondary">
                    <User size={20} />
                  </div>
                )}
              </button>

              {/* ================= DROPDOWN ================= */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 flex flex-col gap-2 z-20">
                  {/* Profile */}
                  <Link
                    to="/account"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-body-md text-text-primary bg-background hover:bg-background-subtle transition-colors"
                  >
                    <User size={20} />
                    Profile
                  </Link>

                  {/* Admin Dashboard — only visible to admins */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-body-md text-text-primary bg-background hover:bg-background-subtle transition-colors"
                    >
                      <LayoutGrid size={20} />
                      Admin Dashboard
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-body-md text-text-primary bg-background hover:bg-background-subtle transition-colors"
                  >
                    <LogOut size={20} />
                    Log Out
                  </button>

                  {/* Settings */}
                  <Link
                    to="/account/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-body-md text-text-primary bg-background hover:bg-background-subtle transition-colors"
                  >
                    <Settings size={20} />
                    Settings
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* ================= GUEST STATE ================= */
            <Link
              to="/login"
              className="text-body-md text-text-primary hover:text-primary"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <nav
          ref={mobileMenuRef}
          className="md:hidden border-t border-border pb-2 py-4"
        >
          <div className="flex flex-col gap-4 px-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                end={link.href === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `relative pb-2 text-body-md transition-colors ${
                    isActive
                      ? "text-primary after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-text-primary hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to={isAuthenticated ? "/account/new-post" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-4 py-2 text-label-md font-medium text-center transition-colors"
            >
              New Post
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default UserHeader;
