import { useState } from "react";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { useMyClaims } from "../../hooks/useMyClaims";

// The four filter tabs, in display order.
const TAB_FILTERS = [
  { label: "All Claims", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Declined", value: "DECLINED" },
];

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
  PENDING: "bg-warning/10 text-warning",
  ACCEPTED: "bg-success/10 text-success",
  DECLINED: "bg-error/10 text-error",
};

const MyClaims = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const queryParams = {
    page,
    limit: 6,
    ...(activeTab === "all" ? {} : { claimStatus: activeTab }),
  };
  const { data: claimsData, isLoading, error } = useMyClaims(queryParams);
  const claims = claimsData?.data ?? [];
  const counts = claimsData?.counts ?? {
    all: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
  };
  const totalPages = claimsData?.pagination?.totalPages ?? 1;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            key={tab.value}
            type="button"
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-body-sm font-medium capitalize transition-colors ${
              activeTab === tab.value
                ? "bg-background text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label} (
            {counts[tab.value === "all" ? "all" : tab.value.toLowerCase()]})
          </button>
        ))}
      </div>

      {/* Claim list */}
      {claims.length === 0 ? (
        <p className="text-body-md text-text-secondary mt-8">
          No claims in this category yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {claims.map((claim) => {
            const item = claim.item;
            return (
              <div
                key={claim.id}
                className="flex items-center gap-4 border border-border rounded-lg p-4"
              >
                {/* Image placeholder — swap for the real item photo later */}
                {item.images?.[0]?.imageUrl ? (
                  <img
                    src={item.images[0].imageUrl}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-label-sm shrink-0">
                    No image
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-heading-3 font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-body-sm text-text-secondary mt-1">
                    <MapPin size={14} />
                    {item.location}
                  </div>
                  <p className="text-body-sm text-text-secondary mt-1">
                    {formatDate(item.dateLostOrFound)} ·{" "}
                    {item.type === "LOST" ? "Lost" : "Found"} ·{" "}
                    {item.status === "RESOLVED" ? "Resolved" : "Searching"}
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-body-sm font-medium capitalize ${STATUS_STYLES[claim.status]}`}
                >
                  {claim.status.toLowerCase()}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() =>
              setPage((currentPage) => Math.max(currentPage - 1, 1))
            }
            disabled={page === 1}
            className="border border-border rounded-lg px-4 py-2 text-body-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-body-sm text-text-secondary">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((currentPage) => Math.min(currentPage + 1, totalPages))
            }
            disabled={page === totalPages}
            className="border border-border rounded-lg px-4 py-2 text-body-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyClaims;
