// Each step: title, description, and its photo.
// Photos are placeholders — swap for the real stock photos later.
const STEPS = [
  {
    title: "Report",
    description: "Report a lost or found item with details and location.",
  },
  {
    title: "Search",
    description: "Browse or search items in your area.",
  },
  {
    title: "Connect",
    description: "Contact the poster and arrange to return it.",
  },
  {
    title: "Reunite",
    description: "Get your item back and make someone's day.",
  },
];

// A single dashed curved connector between two steps, as an SVG path.
// "flip" mirrors the curve horizontally, alternating the S-shape direction
// to roughly follow each card's left/right position.
// NOTE: these curves are a visual approximation, not measured against
// exact card positions — expect to nudge the path/viewBox once this
// is screenshotted against the real layout.
const Connector = ({ flip = false, showArrowhead = false }) => (
  <svg
    viewBox="0 0 200 180"
    className={`w-40 h-44 ${flip ? "-scale-x-100" : ""}`}
    fill="none"
  >
    <path
      d="M20 10 C 180 40, 180 140, 20 170"
      stroke="#1F2933"
      strokeWidth="4"
      strokeDasharray="2 14"
      strokeLinecap="round"
      markerEnd={showArrowhead ? "url(#arrowhead)" : undefined}
    />
    {showArrowhead && (
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="#1F2933" />
        </marker>
      </defs>
    )}
  </svg>
);

const HowItWorks = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-10 py-16">
      {/* NOTE: wireframe has large organic purple shapes behind this whole
          page — deferred per team decision, same as the Home page. */}

      {/* Step 1: Report — left aligned */}
      <div className="flex justify-start">
        <div className="w-80 border border-border rounded-lg p-6">
          <h3 className="text-heading-1 font-bold text-text-primary">
            {STEPS[0].title}
          </h3>
          <p className="text-body-md text-text-secondary mt-2">
            {STEPS[0].description}
          </p>
          <div className="w-full h-56 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
            Image Placeholder
          </div>
        </div>
      </div>

      {/* Connector 1→2: curves right and down */}
      <div className="flex justify-center -my-4">
        <Connector />
      </div>

      {/* Step 2: Search — right aligned */}
      <div className="flex justify-end">
        <div className="w-80 border border-border rounded-lg p-6">
          <h3 className="text-heading-1 font-bold text-text-primary">
            {STEPS[1].title}
          </h3>
          <p className="text-body-md text-text-secondary mt-2">
            {STEPS[1].description}
          </p>
          <div className="w-full h-56 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
            Image Placeholder
          </div>
        </div>
      </div>

      {/* Connector 2→3: curves left and down */}
      <div className="flex justify-center -my-4">
        <Connector flip />
      </div>

      {/* Step 3: Connect — right-of-center aligned */}
      <div className="flex justify-end pr-24">
        <div className="w-80 border border-border rounded-lg p-6">
          <h3 className="text-heading-1 font-bold text-text-primary">
            {STEPS[2].title}
          </h3>
          <p className="text-body-md text-text-secondary mt-2">
            {STEPS[2].description}
          </p>
          <div className="w-full h-56 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
            Image Placeholder
          </div>
        </div>
      </div>

      {/* Connector 3→4: curves left and down, with an arrowhead pointing into Reunite */}
      <div className="flex justify-center -my-4">
        <Connector flip showArrowhead />
      </div>

      {/* Step 4: Reunite — left-of-center aligned */}
      <div className="flex justify-start pl-48">
        <div className="w-80 border border-border rounded-lg p-6">
          <h3 className="text-heading-1 font-bold text-text-primary">
            {STEPS[3].title}
          </h3>
          <p className="text-body-md text-text-secondary mt-2">
            {STEPS[3].description}
          </p>
          <div className="w-full h-56 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
            Image Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
