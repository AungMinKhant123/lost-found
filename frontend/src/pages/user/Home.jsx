import { useLatestItems } from "../../hooks/useLatestItems";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import Button from "../../components/Button";

// Formats an ISO date string into "Sep 6, 2026".
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const Home = () => {
  const {
    data: recentItems = [],
    isLoading,
    isError,
    error,
  } = useLatestItems();

  return (
    <div>
      {/* ================= HERO ================= */}
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

            <Button variant="primary" className="mt-6">
              See Recent Reunion
            </Button>
          </div>

          <div className="w-full h-80 rounded-xl flex items-center justify-center text-text-secondary text-body-sm">
            <img
              src="https://res.cloudinary.com/d5tnusci/image/upload/v1789382550/login_hh77bf.png"
              alt=""
              className="w-200 h-auto"
            />
          </div>
        </div>
      </section>

      {/* ================= LOST / FOUND ================= */}
      <section className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="flex justify-center items-start gap-24">
          <div className="relative pt-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="border border-border rounded-full px-6 py-3 bg-background text-body-md text-primary font-medium shadow-sm">
                Lost??
              </div>

              <div className="w-3 h-3 rounded-full border border-border bg-background mt-1" />
              <div className="w-2 h-2 rounded-full border border-border bg-background mt-1" />
            </div>

            <div className="w-56 h-72 rounded-xl bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
              <img
                src="https://res.cloudinary.com/d5tnusci/image/upload/v1789664528/phone_siep1d.jpg"
                alt=""
                className="w-200 h-auto"
              />
            </div>
          </div>

          <div className="pt-6">
            <div className="border border-border rounded-full w-14 h-14 flex items-center justify-center text-heading-3 font-bold text-text-primary bg-background shadow-sm">
              ?
            </div>
          </div>

          <div className="relative pt-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="border border-border rounded-full px-6 py-3 bg-background text-body-md text-primary font-medium shadow-sm">
                Found??
              </div>

              <div className="w-3 h-3 rounded-full border border-border bg-background mt-1" />
              <div className="w-2 h-2 rounded-full border border-border bg-background mt-1" />
            </div>

            <div className="w-56 h-72 rounded-xl flex items-center justify-center text-text-secondary text-body-sm">
              <img
                src="https://res.cloudinary.com/d5tnusci/image/upload/v1789664555/earphone_zxmi2w.png"
                alt=""
                className="w-300 h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE: SPEED MATTERS ================= */}
      <section className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="grid grid-cols-2 gap-10 items-center">
          <div className="w-full h-72 rounded-xl flex items-center justify-center text-text-secondary text-body-sm">
            <img
              src="https://res.cloudinary.com/d5tnusci/image/upload/v1789664528/phone_siep1d.jpg"
              alt=""
              className="w-50 h-auto"
            />
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
          <div className="w-full h-72 rounded-xl flex items-center justify-center text-text-secondary text-body-sm">
            <img
              src="https://res.cloudinary.com/d5tnusci/image/upload/v1789664555/earphone_zxmi2w.png"
              alt=""
              className="w-50 h-auto"
            />
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

        {isLoading && (
          <p className="text-body-md text-text-secondary mt-8">Loading...</p>
        )}

        {isError && (
          <p className="text-error text-body-md mt-8">Error: {error.message}</p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-[280px_280px_280px] gap-4 mt-8 justify-center">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <div className="w-full h-40 bg-neutral-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
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
                    {item.type === "LOST" ? "Lost" : "Found"} ·{" "}
                    {formatDate(item.createdAt)}
                  </p>

                  <p className="text-body-sm text-text-secondary mt-1">
                    {item.status === "RESOLVED" ? "Resolved" : "Searching"}
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
