import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { logoutUser } from "../../api/authApi";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Item List", href: "/item-list" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About Us", href: "/about-us" },
];

const UserHeader = () => {
  // Reads live auth state from the shared Zustand store — this is the
  // SAME store LogIn.jsx (real login) and window.mockLoginAs (dev-only
  // mock login) both write to, so this Navbar automatically reflects
  // either one without any extra wiring here.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Controls whether the Profile dropdown (Profile / Log Out / Settings)
  // is currently open.
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Closes the dropdown if the user clicks anywhere outside of it —
  // same pattern used for SignUp's Profession dropdown.
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
    try {
      // Call backend logout API.
      // The browser automatically sends the HTTP-only refresh token cookie.
      await logoutUser();

      // Clear frontend Zustand authentication state.
      logout();

      // Close dropdown.
      setIsDropdownOpen(false);

      // Redirect to login.
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-background-subtle border-b border-border px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Logo — real image + wordmark, matching the Footer's logo */}
        <Link to="/">
          <div className="flex justify-center items-center gap-2">
            <img
              src="https://res.cloudinary.com/d5tnusci/image/upload/v1789382451/signup2_bzibei.png"
              alt=""
              className="w-15 h-auto"
            />
            <div className="flex gap-1">
              <h1 className="font-bold text-2xl">Lost</h1>
              <h1 className="text-primary font-bold text-2xl">Found</h1>
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-body-md text-text-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions — content here depends entirely on isAuthenticated */}
        <div className="flex items-center gap-6">
          {/* Guests get sent to /login instead of a dead "#" link. Once
              the real Report Item page exists, this "#" for logged-in
              users should become its actual route. */}
          <Link
            to={isAuthenticated ? "/account/new-post" : "/login"}
            className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-3 text-label-lg font-medium transition-colors"
          >
            New Post
          </Link>

          {isAuthenticated ? (
            // ===== LOGGED-IN STATE: avatar + dropdown =====
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="w-11 h-11 rounded-full overflow-hidden border border-border shrink-0"
              >
                {/* Shows the user's real photo if their account has one,
                    otherwise a neutral placeholder icon. */}
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.firstName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-300 flex items-center justify-center text-text-secondary">
                    <User size={20} />
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 flex flex-col gap-2 z-20">
                  <Link
                    to="/account"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-body-md text-text-primary bg-background hover:bg-background-subtle transition-colors"
                  >
                    <User size={20} />
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-body-md text-text-primary bg-background hover:bg-background-subtle transition-colors"
                  >
                    <LogOut size={20} />
                    Log Out
                  </button>

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
            // ===== GUEST STATE: plain "Log In" link =====
            <Link
              to="/login"
              className="text-body-md text-text-primary hover:text-primary"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
