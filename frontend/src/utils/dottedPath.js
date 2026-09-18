// src/utils/dottedPath.js
//
// Computes an SVG cubic-Bézier path ("S-curve") connecting the facing
// edges of two rectangles, so a dashed connector line can visually link
// two cards regardless of where they're positioned on the page.
//
// Used by HowItWorks.jsx to draw the "Report -> Search -> Connect -> Reunite"
// connector lines dynamically, based on each card's REAL on-screen position
// (via getBoundingClientRect), instead of hardcoded/guessed coordinates.

/**
 * Given two rects (already converted into coordinates relative to a
 * shared container — see toContainerRelativeRect below), returns an SVG
 * path "d" attribute string connecting a point on rectA's bottom edge to
 * a point on rectB's top edge, with a smooth S-curve between them.
 *
 * We always connect bottom-of-A to top-of-B because in this page's
 * layout, cards are stacked top-to-bottom down the page (never
 * side-by-side), so the vertical edges are always the "facing" ones.
 * The horizontal position of each connection point is biased toward the
 * OTHER box, which is what makes the curve visually lean left/right to
 * reach the next card instead of dropping straight down.
 */
export function buildConnectorPath(rectA, rectB) {
  const startX =
    rectA.left + rectA.width / 2 + (rectB.left - rectA.left) * 0.15;
  const startY = rectA.top + rectA.height;

  const endX = rectB.left + rectB.width / 2 + (rectA.left - rectB.left) * 0.15;
  // Stop 10px short of the card's actual top edge, leaving room for the
  // arrowhead marker to render fully visible instead of overlapping/
  // hiding behind the card's border and background.
  const endY = rectB.top - 10;

  const verticalGap = endY - startY;
  const controlPoint1X = startX;
  const controlPoint1Y = startY + verticalGap * 0.5;
  const controlPoint2X = endX;
  const controlPoint2Y = startY + verticalGap * 0.5;

  return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;
}

/**
 * Converts a DOMRect (from getBoundingClientRect, which is relative to
 * the VIEWPORT) into coordinates relative to a container element's
 * top-left corner. This is necessary because our SVG overlay is
 * positioned relative to the container, not the viewport — without this
 * conversion, the path coordinates would be wrong as soon as the page
 * is scrolled.
 */
export function toContainerRelativeRect(elementRect, containerRect) {
  return {
    top: elementRect.top - containerRect.top,
    left: elementRect.left - containerRect.left,
    width: elementRect.width,
    height: elementRect.height,
  };
}
