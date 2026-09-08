import { Link } from "react-router";
import {
  FaYoutube,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";

const footerLinks = [
  {
    title: "PRODUCT",
    links: [
      { label: "Home", href: "/" },
      { label: "Lost Item", href: "#" },
      { label: "Report Item", href: "#" },
      { label: "Found Item", href: "#" },
    ],
  },
  {
    title: "COMMUNITY",
    links: [
      { label: "Guidelines", href: "#" },
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "LEARN",
    links: [
      { label: "How it works?", href: "#" },
      { label: "Getting Started", href: "#" },
      { label: "Safety Tips", href: "#" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "Help", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Contact Support", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: FaYoutube, bg: "bg-[#FF0000]", href: "#" },
  { icon: FaFacebookF, bg: "bg-[#1877F2]", href: "#" },
  { icon: FaXTwitter, bg: "bg-black", href: "#" },
  { icon: FaLinkedinIn, bg: "bg-[#0A66C2]", href: "#" },
];

const UserFooter = () => {
  return (
    <footer className="w-full border-t border-border px-10 py-8">
      <div className="flex flex-wrap justify-between gap-8">
        <div className="max-w-xs">
          {/* Logo placeholder — will be replaced with a single <img> combining icon + wordmark */}
          <div className="w-40 h-10 rounded-lg bg-neutral-300" />

          <p className="text-body-sm text-text-secondary mt-3">
            Helping people find what they've lost and return what they've found.
          </p>
          <div className="flex gap-3 mt-4">
            {socialLinks.map(({ icon: Icon, bg, href }, i) => (
              <a
                key={i}
                href={href}
                className={`${bg} w-9 h-9 rounded-md flex items-center justify-center text-white`}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-label-sm font-semibold text-primary tracking-wide">
              {col.title}
            </h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-body-sm text-text-primary hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-body-sm text-text-primary hover:text-primary"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar — its own bordered box, per the wireframe */}
      <div className="border border-border rounded-lg mt-8 px-4 py-3 flex flex-wrap justify-between gap-2 text-body-sm text-text-secondary">
        <span>© Copyright 2026 Lost &amp; Found. All Right Reserved</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary">
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
