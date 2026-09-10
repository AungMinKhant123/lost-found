import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { getCurrentUser, getClaimsByUser, getItems } from "../../services/api";

// The four filter tabs, in display order.
const TAB_FILTERS = ["all", "pending", "accepted", "declined"];

// Formats an ISO date string ("2026-09-06") into "Sep 6, 2026".
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Maps a claim's status to the pill's text color and background,
// matching the wireframe: orange for pending, green for accepted, red for declined.
const STATUS_STYLES = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  declined: "bg-error/10 text-error",
};

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Fetch the current user's claims AND all items in parallel, since each
    // claim only stores an itemId — we need the actual items to display
    // their title/location/date alongside the claim's status.
    getCurrentUser()
      .then((user) => Promise.all([getClaimsByUser(user.id), getItems()]))
      .then(([claimsData, itemsData]) => {
        setClaims(claimsData);
        setItems(itemsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Looks up the full item object for a given claim, so we can show
  // its title/location/date next to the claim's status.
  const getItemForClaim = (claim) =>
    items.find((item) => item.id === claim.itemId);

  // Filters claims by the active tab, and pre-computes each tab's live
  // count for display on the tab buttons themselves.
  const filteredClaims = claims.filter((claim) =>
    activeTab === "all" ? true : claim.status === activeTab,
  );

  const countFor = (status) =>
    status === "all"
      ? claims.length
      : claims.filter((c) => c.status === status).length;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-heading-1 font-bold text-text-primary">My Claims</h1>
      <p className="text-body-md text-text-secondary mt-2">
        Track the progress of your submitted ownership claims
      </p>

      {/* Tab bar with live counts */}
      <div className="inline-flex bg-neutral-100 rounded-full p-1 mt-6">
        {TAB_FILTERS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-body-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-background text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab === "all" ? "All Items" : tab} ({countFor(tab)})
          </button>
        ))}
      </div>

      {/* Claim list */}
      {filteredClaims.length === 0 ? (
        <p className="text-body-md text-text-secondary mt-8">
          No claims in this category yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {filteredClaims.map((claim) => {
            const item = getItemForClaim(claim);
            if (!item) return null; // Skip if the referenced item no longer exists.

            return (
              <div
                key={claim.id}
                className="flex items-center gap-4 border border-border rounded-lg p-4"
              >
                {/* Image placeholder — swap for the real item photo later */}
                <div className="w-20 h-20 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-label-sm shrink-0">
                  Image
                </div>

                <div className="flex-1">
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
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-body-sm font-medium capitalize ${STATUS_STYLES[claim.status]}`}
                >
                  {claim.status}
                </span>

                <Link
                  to={`/account/claims/${claim.id}`}
                  className="border border-border rounded-lg px-4 py-2 text-body-md text-primary hover:bg-background-subtle transition-colors"
                >
                  View Claim
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
