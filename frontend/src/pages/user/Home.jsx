import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import Button from "../../components/Button";
import { getRecentItems } from "../../services/api";

// Formats an ISO date string ("2026-09-06") into "Sep 6, 2026".
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecentItems(6)
      .then((data) => setRecentItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ================= HERO ================= */}
      {/* NOTE: wireframe has a large organic purple shape behind this whole
          section — deferred per team decision, will be layered in later
          once all pages are built. Content/layout below is final either way. */}
      <section className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="grid grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-display-lg font-bold text-text-primary">
              Campus Lost &amp; Found
            </h1>
            <p className="text-body-lg text-text-secondary mt-4 max-w-md">
              Report what you lost, post what you found, and keep your contact
              details private until a claim is confirmed
            </p>
            {/* No destination decided yet — confirm with UI/UX before wiring this up. */}
            <Button variant="primary" className="mt-6">
              See Recent Reunion
            </Button>
          </div>

          {/* Illustration placeholder — swap for the real box/items image later */}
          <div className="w-full h-80 rounded-xl bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
            Image Placeholder
          </div>
        </div>
      </section>

      {/* ================= LOST?? FOUND?? ================= */}
      <section className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="flex justify-center items-start gap-24">
          {/* Left: Lost thought bubble + photo */}
          <div className="relative pt-20">
            {/* Thought bubble: main oval + trailing circles pointing down toward the photo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="border border-border rounded-full px-6 py-3 bg-background text-body-md text-primary font-medium shadow-sm">
                Lost??
              </div>
              <div className="w-3 h-3 rounded-full border border-border bg-background mt-1" />
              <div className="w-2 h-2 rounded-full border border-border bg-background mt-1" />
            </div>

            {/* Photo placeholder — swap for the real stock photo later */}
            <div className="w-56 h-72 rounded-xl bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
              Image Placeholder
            </div>
          </div>

          {/* Center "?" thought bubble, floating between the two photos */}
          <div className="pt-6">
            <div className="border border-border rounded-full w-14 h-14 flex items-center justify-center text-heading-3 font-bold text-text-primary bg-background shadow-sm">
              ?
            </div>
          </div>

          {/* Right: Found thought bubble + photo */}
          <div className="relative pt-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="border border-border rounded-full px-6 py-3 bg-background text-body-md text-primary font-medium shadow-sm">
                Found??
              </div>
              <div className="w-3 h-3 rounded-full border border-border bg-background mt-1" />
              <div className="w-2 h-2 rounded-full border border-border bg-background mt-1" />
            </div>

            {/* Photo placeholder — swap for the real stock photo later */}
            <div className="w-56 h-72 rounded-xl bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
              Image Placeholder
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE: SPEED MATTERS ================= */}
      {/* NOTE: wireframe wraps this + the next feature block in a shared
          purple organic shape — deferred, see note above. */}
      <section className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="grid grid-cols-2 gap-10 items-center">
          {/* Image placeholder — swap for the real phone product photo later */}
          <div className="w-full h-72 rounded-xl bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
            Image Placeholder
          </div>

          <div>
            <p className="text-heading-3 font-semibold text-primary">
              SPEED MATTERS
            </p>
            <h2 className="text-display-md font-bold text-text-primary mt-2">
              Most items are <br /> reunited in 48 hours
            </h2>
            <p className="text-body-md text-text-secondary mt-4 max-w-sm">
              Or the listing stays open, free of charge, for as long as it takes
              — nobody pays to post, search, or claim.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURE: HUMAN REVIEW ================= */}
      <section className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="grid grid-cols-2 gap-10 items-center">
          {/* Image placeholder — swap for the real headphones product photo later */}
          <div className="w-full h-72 rounded-xl bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
            Image Placeholder
          </div>

          <div>
            <p className="text-heading-3 font-semibold text-primary">
              A REAL PERSON, NOT AN ALGORITHM
            </p>
            <h2 className="text-display-md font-bold text-text-primary mt-2">
              Every claim gets a<br /> human review
            </h2>
            <p className="text-body-md text-text-secondary mt-4 max-w-sm">
              Contact details only unlock once a poster accepts a claim — and
              admin can always step in if two people believe the same item is
              theirs.
            </p>
          </div>
        </div>
      </section>

      {/* ================= RECENTLY REPORTED ITEMS ================= */}
      <section className="max-w-[1280px] mx-auto px-10 py-16">
        <h2 className="text-display-md font-bold text-text-primary">
          Recently Reported
          <br /> Items
        </h2>
        <p className="text-body-md text-text-secondary mt-2">
          Take a look at the latest lost and found items in our community
        </p>

        {loading && (
          <p className="text-body-md text-text-secondary mt-8">Loading...</p>
        )}
        {error && (
          <p className="text-error text-body-md mt-8">Error: {error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-[280px_280px_280px] gap-4 mt-8 justify-center">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                {/* Image placeholder — swap for the real uploaded photo once
                    the Report Item feature exists and items have a real image URL. */}
                <div className="w-full h-40 bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
                  Image Placeholder
                </div>

                <div className="p-4">
                  <h3 className="text-heading-3 font-bold text-text-primary">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 text-body-sm text-text-secondary mt-1">
                    <MapPin size={14} />
                    {item.location}
                  </div>

                  <p className="text-body-sm text-text-secondary mt-1">
                    {formatDate(item.date)} ·{" "}
                    {item.resolved ? "Resolved" : "Searching"}
                  </p>

                  <Link
                    to={`/items/${item.id}`}
                    className="mt-3 inline-flex items-center justify-center w-full border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary transition-colors"
                  >
                    More Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
