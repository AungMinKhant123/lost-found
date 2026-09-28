import { useLatestItems } from "../../hooks/useLatestItems";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import Button from "../../components/Button";
import DecorativeBackground from "../../components/DecorativeBackground/DecorativeBackground";

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
    <div className="relative w-full">
      <DecorativeBackground variant="home" />

      <div className="relative z-10">
        {/* ================= HERO ================= */}
        <section className="max-w-[1280px] mx-auto px-10 py-16">
          <div className="grid grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-display-lg font-bold text-text-inverse">
                Campus Lost
                <br /> &amp; Found
              </h1>

              <p className="text-body-lg text-text-inverse mt-4 max-w-md">
                Report what you lost, post what you found, and keep your contact
                details private until a claim is confirmed
              </p>

              <Button
                variant="primary"
                className="mt-6 !bg-[#F8FAFC] !text-[#4B32A8] hover:!bg-primary-dark hover:!text-text-inverse"
              >
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
          <div className="relative h-[420px]">
            {/* Lost bubble */}
            <div className="absolute left-[25%] top-[140px] w-24 h-24 border border-border rounded-full bg-background flex items-center justify-center text-body-md text-primary font-medium shadow-sm -rotate-25">
              Lost??
            </div>

            {/* Question bubble */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[75px] w-20 h-20 border border-border rounded-full bg-background flex items-center justify-center text-heading-3 font-bold text-text-primary shadow-sm rotate-10">
              ?
            </div>

            {/* Found bubble */}
            <div className="absolute right-[29%] top-[150px] w-24 h-24 border border-border rounded-full bg-background flex items-center justify-center text-body-md text-primary font-medium shadow-sm rotate-20">
              Found??
            </div>

            {/* Phone */}
            <div className="absolute left-[25%] top-[20px] w-100 h-202 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/d5tnusci/image/upload/v1790133618/phone_siep1d.png"
                alt=""
                className="w-70 h-auto rotate-10"
              />
            </div>
          </div>
        </section>

        {/* ================= FEATURE: SPEED MATTERS ================= */}
        <section className="max-w-[1280px] mx-auto px-10 py-16">
          <div className="grid grid-cols-2 gap-10 items-center">
            <div className="w-full h-72 rounded-xl flex items-center justify-center text-text-secondary text-body-sm">
              {/* <img
                src="https://res.cloudinary.com/d5tnusci/image/upload/v1790133618/phone_siep1d.png"
                alt=""
                className="w-50 h-auto"
              /> */}
            </div>

            <div>
              <p className="text-heading-3 font-semibold text-primary">
                SPEED MATTERS
              </p>

              <h2 className="text-display-md font-bold text-text-primary mt-2">
                Most items are <br /> reunited in 48 hours
              </h2>

              <p className="text-body-md text-text-secondary mt-4 max-w-sm">
                Or the listing stays open, free of charge, for as long as it
                takes - nobody pays to post, search, or claim.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FEATURE: HUMAN REVIEW ================= */}
        <section className="max-w-[1280px] mx-auto px-10 py-16">
          <div className="grid grid-cols-2 gap-10 items-center">
            <div className="w-full h-102 rounded-xl flex items-center justify-center text-text-secondary text-body-sm">
              <img
                src="https://res.cloudinary.com/d5tnusci/image/upload/v1789664555/earphone_zxmi2w.png"
                alt=""
                className="w-90 h-auto absolute left-[12%] top-[1320px] rotate-35"
              />
            </div>

            <div className="-ml-35 mt-10">
              <p className="text-heading-3 font-semibold text-primary">
                A REAL PERSON, NOT AN ALGORITHM
              </p>

              <h2 className="text-display-md font-bold text-text-primary mt-2">
                Every claim gets a<br /> human review
              </h2>

              <p className="text-body-md text-text-secondary mt-4 max-w-sm">
                Contact details only unlock once a poster accepts a claim - and
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
            <p className="text-error text-body-md mt-8">
              Error: {error.message}
            </p>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-[280px_280px_280px] gap-4 mt-8 justify-center">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div className="w-full h-40 bg-neutral-100 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-text-secondary text-body-sm">
                        Image Placeholder
                      </span>
                    )}
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
    </div>
  );
};

export default Home;
