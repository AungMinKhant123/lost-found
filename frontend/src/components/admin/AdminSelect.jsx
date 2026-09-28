import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// A styled dropdown matching the app's existing custom-select pattern
// (see SignUp's Profession field), used to replace native <select>
// elements in the admin pages so they match our brand instead of the
// browser's default styling.
//
// options: array of { value, label }
const AdminSelect = ({ value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 border border-border rounded-lg pl-4 pr-3 py-2.5 text-body-sm text-text-primary bg-background"
      >
        {selectedLabel}
        <ChevronDown
          size={16}
          className={`text-text-secondary transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-20 w-full mt-1 border border-border rounded-lg bg-surface shadow-lg overflow-hidden">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-body-sm text-text-primary hover:bg-primary hover:text-text-inverse"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminSelect;
