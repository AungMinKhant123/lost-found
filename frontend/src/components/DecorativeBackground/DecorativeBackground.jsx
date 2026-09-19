import { designs } from "./designs";
import Circle from "./Circle";
import Blob from "./Blob";

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
  if (!shapes) return null;

  return (
    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden pointer-events-none z-0">
      {shapes.map((shape, i) => {
        if (shape.type === "blob") {
          return <Blob key={i} {...shape} />;
        }
        // Default to circle for backward compatibility with existing
        // account designs, which don't have a "type" field yet.
        return <Circle key={i} {...shape} />;
      })}
    </div>
  );
};

export default DecorativeBackground;
