import { useEffect } from "react";
import { useLocation } from "react-router";

// React Router doesn't reset scroll position on navigation by default —
// unlike a traditional multi-page site, it just swaps the page content
// in place, leaving you wherever you happened to be scrolled to. This
// component watches the URL (via useLocation) and scrolls back to the
// top every time it changes, restoring the behavior users expect.
//
// Renders nothing — it's a side-effect-only component. Must be placed
// INSIDE the Router (so useLocation works) but doesn't need to wrap
// anything.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
