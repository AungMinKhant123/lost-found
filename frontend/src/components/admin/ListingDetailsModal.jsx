import { X } from "lucide-react";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

const CLAIM_STATUS_STYLES = {
  pending: "bg-info/10 text-info",
  accepted: "bg-success/10 text-success",
  declined: "bg-error/10 text-error",
};

// item: the full item record, with posterName/posterContact already
// attached by the parent (ManageListings), plus a "claims" array where
// each claim already has its claimant's name attached too — this modal
// is purely presentational, all joining happens in the parent.
const ListingDetailsModal = ({ item, onClose, onDeleteClick }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto admin-scrollbar">
        <div className="flex items-start justify-between">
          <h2 className="text-heading-2 font-bold text-text-primary">
            {item.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="border border-border rounded-lg p-2 text-text-secondary hover:bg-background-subtle shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <span
          className={`inline-block mt-3 px-3 py-1 rounded-full text-label-sm font-medium ${
            item.status === "lost"
              ? "bg-warning/10 text-warning"
              : "bg-success/10 text-success"
          }`}
        >
          {item.status.toUpperCase()}
        </span>

        <div className="w-32 h-32 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
          {item.images?.[0]?.imageUrl ? (
            <img
              src={item.images[0].imageUrl}
              alt={item.title}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            "Image"
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <p className="text-body-sm font-medium text-text-primary">
              Category
            </p>
            <p className="text-body-md text-text-secondary mt-0.5">
              {item.category || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-text-primary">
              Location
            </p>
            <p className="text-body-md text-text-secondary mt-0.5">
              {item.location}
            </p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-text-primary">Colour</p>
            <p className="text-body-md text-text-secondary mt-0.5">
              {item.color || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-text-primary">Date</p>
            <p className="text-body-md text-text-secondary mt-0.5">
              {formatDate(item.date)}
            </p>
          </div>
        </div>

        {item.description && (
          <p className="text-body-md text-text-primary mt-5">
            {item.description}
          </p>
        )}

        {/* Poster contact */}
        <h3 className="text-heading-3 font-bold text-text-primary mt-6">
          Poster contact
        </h3>
        <div className="border border-border rounded-lg p-4 mt-2 space-y-1">
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Name</span>
            <span className="text-text-primary">{item.posterName}</span>
          </div>
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Phone</span>
            <span className="text-text-primary">
              {item.posterPhone || "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Email</span>
            <span className="text-text-primary">
              {item.posterEmail || "N/A"}
            </span>
          </div>
        </div>

        {/* Claim history */}
        <h3 className="text-heading-3 font-bold text-text-primary mt-6">
          Claim history ({item.claims.length})
        </h3>
        <div className="flex flex-col gap-3 mt-2">
          {item.claims.length === 0 && (
            <p className="text-body-sm text-text-secondary">
              No claims on this item yet.
            </p>
          )}
          {item.claims.map((claim) => (
            <div key={claim.id} className="border border-border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <p className="text-body-md font-bold text-text-primary">
                  {claim.claimantName}
                </p>
                <span
                  className={`px-3 py-0.5 rounded-full text-label-sm font-medium capitalize ${CLAIM_STATUS_STYLES[claim.status]}`}
                >
                  {claim.status}
                </span>
              </div>
              <p className="text-body-sm text-text-primary mt-1">
                "{claim.message}"
              </p>
              <p className="text-label-sm text-text-secondary mt-1">
                Submitted {formatTimeAgo(claim.claimedAt)}
              </p>
            </div>
          ))}
        </div>

        {/* Centered delete button, fixing the wireframe's off-alignment */}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onDeleteClick}
            className="bg-error hover:bg-error/90 text-white rounded-lg px-8 py-2.5 text-body-md font-medium transition-colors"
          >
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsModal;
