import { useLayoutEffect, useRef, useState, useCallback } from "react";
import {
  buildConnectorPath,
  toContainerRelativeRect,
} from "../../utils/dottedPath";
import DecorativeBackground from "../../components/DecorativeBackground/DecorativeBackground";

// Each step: title, description, and its own absolute position.
// UNCHANGED from before — card positions/lines are untouched, only the
// scroll animation logic below is new.
const STEPS = [
  {
    title: "Report",
    description: "Report a lost or found item with details and location.",
    className: "left-[95px] top-[80px]",
    photo:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923340/howdoesitwork1_luaqcu.jpg",
  },
  {
    title: "Search",
    description: "Browse or search items in your area.",
    className: "right-[90px] top-[650px]",
    photo:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923340/howdoesitwork2_rqrkbk.jpg",
  },
  {
    title: "Connect",
    description: "Contact the poster and arrange to return it.",
    className: "right-[425px] top-[1250px]",
    photo:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923340/howdoesitwork3_qobbo5.jpg",
  },
  {
    title: "Reunite",
    description: "Get your item back and make someone's day.",
    className: "left-[180px] top-[1800px]",
    photo:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923340/howdoesitwork4_cesaqi.jpg",
  },
];

// A fixed "trigger line," measured in px down from the top of the
// viewport. This is the invisible horizontal line the research describes:
// as the container scrolls up through this line, that's what drives
// progress from 0 to 1. Tweak this number to make the snake reach the
// end sooner/later relative to how far you've scrolled.
const TRIGGER_LINE_PX = 300;

const HowItWorks = () => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  // ===== LAYER 1: build the full path (same as before) =====
  // "paths" holds one d-string per connector segment (Report->Search,
  // Search->Connect, Connect->Reunite), still used to actually DRAW the
  // three dotted line segments on screen, unchanged from before.
  const [paths, setPaths] = useState([]);

  // "combinedPath" glues all three segments into ONE continuous d-string.
  // We need this because SVG's getTotalLength()/getPointAtLength() only
  // work on a single <path> element — to treat "Report all the way to
  // Reunite" as one measurable track (the snake's full route), the three
  // separate segments have to become one path for measurement purposes,
  // even though we still render them as visually separate dotted lines.
  const [combinedPath, setCombinedPath] = useState("");

  const [containerHeight, setContainerHeight] = useState(800);

  // A hidden <path> element, invisible on screen (rendered with
  // opacity: 0 inside the SVG), whose ONLY job is to hold combinedPath
  // so we can call the browser's built-in getTotalLength() and
  // getPointAtLength() on it. These two methods don't exist as plain
  // JS math — they're SVG DOM methods, so we need a real <path> element
  // in the document to ask these questions of.
  const measurePathRef = useRef(null);

  // The measured total length (in SVG user units) of the full
  // Report->Reunite route. Needed so we can convert "progress" (0 to 1)
  // into "how many units along the path" (0 to totalLength).
  const [totalLength, setTotalLength] = useState(0);

  // ===== LAYER 2: turn scroll into a number from 0 to 1 =====
  // How far along the snake's track we currently are: 0 = hasn't
  // started (stays at Report), 1 = fully complete (reached Reunite).
  const [progress, setProgress] = useState(0);

  // The moving arrowhead's current position + rotation angle, computed
  // from "progress" each time it changes. x/y are in the same coordinate
  // space as the container (same space the cards/paths use).
  const [arrowState, setArrowState] = useState({ x: 0, y: 0, angleDeg: 0 });

  // Re-measures every card's position and rebuilds the connector paths
  // (both the per-segment array for drawing, and the combined string for
  // measurement) — unchanged in purpose from before, just now also
  // updates combinedPath.
  const recomputePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const cardRects = cardRefs.current.map((cardEl) => {
      if (!cardEl) return null;
      return toContainerRelativeRect(
        cardEl.getBoundingClientRect(),
        containerRect,
      );
    });

    const newPaths = [];
    for (let i = 0; i < cardRects.length - 1; i++) {
      const rectA = cardRects[i];
      const rectB = cardRects[i + 1];
      if (!rectA || !rectB) continue;
      newPaths.push(buildConnectorPath(rectA, rectB));
    }
    setPaths(newPaths);
    // Joining with a space is valid SVG path syntax: each segment starts
    // with its own "M" (move-to), so this reads as one path made of
    // three separate subpaths back-to-back — exactly what we want for
    // measuring total length across all three.
    // Build ONE continuous path for measurement/masking purposes, distinct
    // from "paths" above (which stays as separate segments for drawing the
    // visible dotted lines). Simply joining the segments with a space would
    // still leave each one starting with its own "M" (move-to) command —
    // and browsers restart the dash pattern at every "M", which breaks the
    // single "one dash = full length" reveal trick used by the mask below.
    // Converting every M after the first into an L (straight line-to) fixes
    // this: it bridges the small gap between one segment's end and the
    // next's start with an invisible straight line (invisible because it
    // passes directly behind the card sitting on top of it), turning the
    // whole thing into one true unbroken subpath instead of three.
    const continuousPath = newPaths
      .map((segment, i) => (i === 0 ? segment : segment.replace(/^M/, "L")))
      .join(" ");
    setCombinedPath(continuousPath);

    const lowestPoint = cardRects.reduce((max, rect) => {
      if (!rect) return max;
      return Math.max(max, rect.top + rect.height);
    }, 0);
    setContainerHeight(lowestPoint + 80);
  }, []);

  // After combinedPath changes (i.e., after cards move or the page first
  // renders), re-measure the hidden path's total length. This has to run
  // AFTER the <path> element actually has the new "d" attribute applied
  // to the DOM, which is why it's a separate effect keyed on combinedPath
  // rather than being computed inline during recomputePaths above.
  useLayoutEffect(() => {
    if (measurePathRef.current && combinedPath) {
      setTotalLength(measurePathRef.current.getTotalLength());
    }
  }, [combinedPath]);

  // Computes "progress" (0 to 1) from the container's current position
  // relative to the fixed TRIGGER_LINE_PX, then converts that into the
  // arrowhead's exact (x, y, rotation) using the SAME hidden path used
  // for length measurement — this is what keeps the dots (mask) and the
  // arrow (this function) perfectly in sync, since they're both reading
  // off the same "distance traveled along the path" number.
  const updateProgressFromScroll = useCallback(() => {
    const container = containerRef.current;
    const measurePath = measurePathRef.current;
    if (!container || !measurePath || totalLength === 0) return;

    const containerRect = container.getBoundingClientRect();

    // containerRect.top is where the container's TOP currently sits in
    // the viewport. As the user scrolls down, this number gets smaller
    // (more negative) — the container moves up the screen.
    //
    // progress = 0 when the container's top is still AT or BELOW the
    // trigger line (we haven't scrolled into it yet).
    //
    // progress = 1 once the container's BOTTOM reaches the BOTTOM of the
    // viewport — not the top. Using the viewport's bottom as the finish
    // line (instead of requiring the container to scroll all the way up
    // past a line near the TOP of the screen) means the scroll distance
    // needed to finish is always guaranteed to exist on the page: it
    // never depends on how much content (like the footer) comes after
    // the container. Requiring completion near the top of the screen
    // needs a lot of extra scroll room below to be possible — more than
    // a normal-height footer provides — which is why the arrow used to
    // get stuck before finishing.
    const scrolledPastTrigger = TRIGGER_LINE_PX - containerRect.top;
    const totalScrollNeeded =
      TRIGGER_LINE_PX + containerRect.height - window.innerHeight;
    const rawProgress = scrolledPastTrigger / totalScrollNeeded;
    const clampedProgress = Math.min(1, Math.max(0, rawProgress));

    setProgress(clampedProgress);

    // ===== LAYER 3 (arrow half): find the point at this distance =====
    const distance = clampedProgress * totalLength;
    const point = measurePath.getPointAtLength(distance);

    // To rotate the arrow so it points ALONG the curve (not just
    // sideways), we look at a point slightly behind it on the path and
    // measure the angle between the two — this gives us the path's
    // current direction of travel at this exact spot.
    const behindDistance = Math.max(0, distance - 1);
    const behindPoint = measurePath.getPointAtLength(behindDistance);
    const angleRad = Math.atan2(
      point.y - behindPoint.y,
      point.x - behindPoint.x,
    );
    const angleDeg = (angleRad * 180) / Math.PI;

    setArrowState({ x: point.x, y: point.y, angleDeg });
  }, [totalLength]);

  useLayoutEffect(() => {
    recomputePaths();

    const resizeObserver = new ResizeObserver(() => {
      recomputePaths();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", recomputePaths);

    if (document.fonts) {
      document.fonts.ready.then(recomputePaths);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", recomputePaths);
    };
  }, [recomputePaths]);

  // Separate effect for the SCROLL listener specifically, since it
  // depends on totalLength being measured first (updateProgressFromScroll
  // does nothing useful until totalLength > 0).
  useLayoutEffect(() => {
    if (totalLength === 0) return;

    // requestAnimationFrame throttling: scroll events can fire dozens of
    // times per frame, but we only need to recalculate once per actual
    // browser repaint — this "ticking" flag prevents piling up redundant
    // work and keeps the animation smooth instead of janky.
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgressFromScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run once immediately so the snake is positioned correctly even
    // before the user scrolls at all (e.g. if the page loads already
    // partway scrolled down, or to set the initial "stays at Report" state).
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalLength, updateProgressFromScroll]);

  return (
    <div
      ref={containerRef}
      className="max-w-[1280px] mx-auto px-10 py-16 relative"
      style={{ height: `${containerHeight}px` }}
    >
      {/* NOTE: wireframe has large organic purple shapes behind this whole
          page — deferred per team decision, same as the Home page. */}
      <DecorativeBackground variant="howItWorks" />

      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* ===== LAYER 3 (mask half): the "curtain" ===== */}
          {/* This mask contains a SOLID (not dotted) white stroke, traced
              along the exact same combinedPath as the visible dots. In
              SVG masks, white = visible, black/transparent = hidden.
              By animating this stroke's dasharray/dashoffset, we can
              reveal it progressively from the start — like sliding a
              curtain open — WITHOUT touching the visible dotted line's
              own dasharray (which is reserved for the dot pattern itself,
              not for revealing). This is exactly the "why a mask" reasoning
              from the research: the two dasharray purposes would otherwise
              conflict on the same element. */}
          <mask id="snake-reveal-mask">
            <path
              d={combinedPath}
              stroke="white"
              // Wider than the visible line's stroke width, so the mask
              // fully covers/reveals it with no thin unmasked edges.
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              // The classic "draw a line on scroll" trick: make ONE dash
              // exactly as long as the whole path (strokeDasharray =
              // totalLength), then shift it with strokeDashoffset. At
              // offset = totalLength, the single dash is shifted
              // completely out of view (nothing revealed). At offset = 0,
              // it's shifted fully into place (everything revealed).
              strokeDasharray={totalLength}
              strokeDashoffset={totalLength - progress * totalLength}
            />
          </mask>
        </defs>

        {/* Hidden measurement-only path: never visible (opacity 0), exists
            purely so measurePathRef can call getTotalLength()/
            getPointAtLength() on it in the logic above. */}
        <path ref={measurePathRef} d={combinedPath} style={{ opacity: 0 }} />

        {/* The visible dotted connector lines, exactly as before —
            EXCEPT now wrapped in a <g> with the reveal mask applied, so
            they progressively appear as "progress" increases, instead of
            being fully visible immediately. */}
        <g mask="url(#snake-reveal-mask)">
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="#1F2933"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray="1 14"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* ===== LAYER 3 (arrow half): the moving arrowhead ===== */}
        {/* Drawn as its own small triangle, positioned via a transform
            (translate to the current point, then rotate to face the
            path's current direction) — this is the "snake's head,"
            always sitting exactly at the edge of however much of the
            dotted body (above) has been revealed so far. Only rendered
            once progress > 0, so it doesn't show sitting at Report
            before the user has scrolled at all. */}
        {progress > 0 && (
          <path
            d="M-8,-6 L8,0 L-8,6 Z"
            fill="#1F2933"
            transform={`translate(${arrowState.x}, ${arrowState.y}) rotate(${arrowState.angleDeg})`}
          />
        )}
      </svg>

      {STEPS.map((step, i) => (
        <div
          key={step.id}
          ref={(el) => (cardRefs.current[i] = el)}
          className={`absolute w-80 border border-border rounded-lg p-6 bg-background z-10 ${step.className}`}
        >
          <h3 className="text-heading-1 font-bold text-text-primary">
            {step.title}
          </h3>
          <p className="text-body-md text-text-secondary mt-2">
            {step.description}
          </p>
          <div className="w-full h-56 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
            <img src={step.photo} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HowItWorks;
