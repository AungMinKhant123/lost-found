import { Link } from "react-router";
import { User } from "lucide-react";
import Button from "../Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Report Items", href: "#" },
  { label: "How it works", href: "#" },
  { label: "Lost Items", href: "#" },
];

const UserHeader = () => {
  return (
    <header className="w-full bg-background-subtle border-b border-border px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Logo placeholder — will be replaced with a single <img> combining icon + wordmark */}
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

        {/* Auth actions */}
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-body-md text-text-primary hover:text-primary"
          >
            Log In
          </Link>
          <Button variant="primary" className="gap-2">
            <User size={16} />
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
