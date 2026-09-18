import { Link } from "react-router";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Item List", href: "/item-list" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About Us", href: "#" },
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

        {/* Auth actions — logged-out state: New Post + Log In */}
        <div className="flex items-center gap-6">
          {/* No destination yet — Report Item page doesn't exist */}
          <Link
            to="#"
            className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-3 text-label-lg font-medium transition-colors"
          >
            New Post
          </Link>
          <Link
            to="/login"
            className="text-body-md text-text-primary hover:text-primary"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
