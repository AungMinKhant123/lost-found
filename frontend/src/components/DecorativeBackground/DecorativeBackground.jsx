import { useEffect, useState } from "react";
import { designs } from "./designs";
import Circle from "./Circle";
import Blob from "./Blob";

// Shape positions/sizes in designs.js are tuned for DESKTOP page
// geometry (fixed px `top`/`left`/`right`). On phones those same values
// make blobs far too wide (they swallow the content), so a shape entry
// can carry an optional `mobile: { ... }` object with overrides that are
// applied below Tailwind's `lg` breakpoint (1024px) — e.g. pushing a
// blob mostly off-screen (left: -460) so only an edge sliver shows, or
// `mobile: { hidden: true }` to drop it entirely on small screens.
const MOBILE_QUERY = "(max-width: 1023px)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(MOBILE_QUERY).matches
      : false,
  );

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event) => setIsMobile(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
};

// Renders the full set of decorative circles for a given page "variant."
//
// FULL-BLEED TECHNIQUE: w-screen is 100vw — the TRUE browser viewport
// width, completely independent of any parent container's actual
// computed width (unlike w-full, which is 100% of the nearest parent,
// and silently inherits any padding/max-width constraints from
// ancestors further up the tree — which was the actual bug before:
// some ancestor above this component was narrower than the real
// screen, so w-full never reached the true edges).
//
// left-1/2 + -translate-x-1/2 re-centers this now-viewport-width
// element regardless of where it sits in a narrower/offset parent —
// this pairing is the standard way to "break out" of a parent's
// horizontal constraints for exactly this kind of full-width visual.
//
// top-0 bottom-0 (rather than reusing w-full's height) makes this
// still span the FULL HEIGHT of its positioned ancestor (the "relative
// w-full" wrapper in AccountLayout.jsx) — that part was already
// correct and unrelated to the width bug, so it's unchanged.
const DecorativeBackground = ({ variant }) => {
  const shapes = designs[variant];
  const isMobile = useIsMobile();
  if (!shapes) return null;

  return (
    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden pointer-events-none z-0">
      {shapes.map((shape, i) => {
        // Merge the mobile overrides (if any) for the current viewport.
        const { mobile, ...base } = shape;
        const overrides = isMobile ? mobile : undefined;

        if (overrides?.hidden) return null;

        const merged = { ...base, ...overrides };

        if (merged.type === "blob") {
          return <Blob key={i} {...merged} />;
        }
        // Default to circle for backward compatibility with existing
        // account designs, which don't have a "type" field yet.
        return <Circle key={i} {...merged} />;
      })}
    </div>
  );
};

export default DecorativeBackground;
