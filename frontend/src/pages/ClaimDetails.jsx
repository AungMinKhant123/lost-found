import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { MapPin, ShieldAlert, Clock } from "lucide-react";
import { getClaimById, getItemById } from "../services/api";

// Same status-pill colors used in My Claims, for consistency.
const STATUS_STYLES = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  declined: "bg-error/10 text-error",
};

// Formats an ISO datetime ("2026-08-08T10:45:00") into "Aug 8, 2026 · 10:45 AM".
function formatDateTime(isoString) {
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart}`;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const ClaimDetails = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First fetch the claim, then fetch the item it points to —
    // we need both to render the page.
    getClaimById(id)
      .then((claimData) => {
        setClaim(claimData);
        return getItemById(claimData.itemId);
      })
      .then((itemData) => setItem(itemData))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!claim || !item) return <div>Claim not found.</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-heading-1 font-bold text-text-primary">
        Claim Details
      </h1>

      {/* Item summary + status pill */}
      <div className="flex items-center gap-4 mt-6">
        {/* Image placeholder — swap for the real item photo later */}
        <div className="w-20 h-20 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-label-sm shrink-0">
          Image
        </div>

        <div className="flex-1">
          <h2 className="text-heading-3 font-bold text-text-primary">
            {item.title}
          </h2>
          <div className="flex items-center gap-1 text-body-sm text-text-secondary mt-1">
            <MapPin size={14} />
            {capitalize(item.status)} · {item.location}
          </div>
          <p className="text-body-sm text-text-secondary mt-1">
            Claimed {formatDateTime(claim.claimedAt)}
          </p>
        </div>

        <span
          className={`px-4 py-1.5 rounded-full text-body-sm font-medium capitalize ${STATUS_STYLES[claim.status]}`}
        >
          {claim.status}
        </span>
      </div>

      {/* Claim message */}
      <div className="mt-8">
        <h2 className="text-heading-3 font-bold text-text-primary">
          Claim message
        </h2>
        <p className="text-body-md text-text-primary mt-2">{claim.message}</p>
      </div>

      {/* Conditional section based on status */}
      {claim.status === "accepted" && (
        <div className="border border-border rounded-lg p-6 mt-6">
          <h3 className="text-heading-3 font-bold text-text-primary">
            Contact Information
          </h3>

          <div className="flex items-center gap-3 mt-4">
            {/* Avatar placeholder — swap for the real poster photo later */}
            <div className="w-14 h-14 rounded-full bg-neutral-300 shrink-0" />
            <div>
              <p className="text-heading-3 font-bold text-text-primary">
                {item.postedBy?.name}
              </p>
              <p className="text-body-sm text-text-secondary">
                {formatDateTime(claim.claimedAt)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-body-md font-medium text-text-primary">
              Phone Number
            </label>
            <div className="border border-border rounded-lg px-4 py-2.5 mt-1 text-body-md text-text-secondary">
              {item.postedBy?.phone}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-body-md font-medium text-text-primary">
              Email
            </label>
            <div className="border border-border rounded-lg px-4 py-2.5 mt-1 text-body-md text-text-secondary">
              {item.postedBy?.email}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Link
              to="/account/claims"
              className="border border-border rounded-lg px-4 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary transition-colors"
            >
              Back to My Claims
            </Link>
          </div>
        </div>
      )}

      {claim.status === "declined" && (
        <div className="border border-border rounded-lg p-8 mt-6 flex flex-col items-center text-center">
          <ShieldAlert size={32} className="text-error" />
          <h3 className="text-heading-3 font-bold text-text-primary mt-3">
            Information message
          </h3>
          <p className="text-body-md text-primary mt-2 max-w-sm">
            Your claim was declined. The item remains open and other pending
            claims are unaffected.
          </p>

          <Link
            to="/account/claims"
            className="mt-8 border border-border rounded-lg px-4 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary"
          >
            Back to My Claims
          </Link>
        </div>
      )}

      {claim.status === "pending" && (
        // No wireframe was provided for this state — placeholder design,
        // confirm with UI/UX before treating this as final.
        <div className="border border-border rounded-lg p-8 mt-6 flex flex-col items-center text-center">
          <Clock size={32} className="text-warning" />
          <h3 className="text-heading-3 font-bold text-text-primary mt-3">
            Waiting for a response
          </h3>
          <p className="text-body-md text-primary mt-2 max-w-sm">
            Your claim is still under review. You'll be notified once the poster
            responds.
          </p>

          <Link
            to="/account/claims"
            className="mt-8 border border-border rounded-lg px-4 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary"
          >
            Back to My Claims
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClaimDetails;
