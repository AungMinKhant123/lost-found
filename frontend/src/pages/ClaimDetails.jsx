import { useParams, Link } from "react-router";
import { MapPin, ShieldAlert, Clock } from "lucide-react";
import CancelClaimButton from "../components/user/CancelClaimButton";
import { useMyClaimDetails } from "../hooks/useMyClaimDetails";

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
  const { data: claim, isLoading, error } = useMyClaimDetails(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return <div>Error: {error.response?.data?.message ?? error.message}</div>;
  }
  const item = claim?.item;
  if (!claim || !item) return <div>Claim not found.</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-heading-1 font-bold text-text-primary">
        Claim Details
      </h1>

      {/* Item summary + status pill */}
      <div className="flex items-start gap-4 mt-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {item.images?.[0]?.imageUrl ? (
            <img
              src={item.images[0].imageUrl}
              alt={item.title}
              className="w-20 h-20 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-label-sm shrink-0">
              Image
            </div>
          )}

          <div className="min-w-0">
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

            {/* Mobile status */}
            <span
              className={`inline-block w-fit mt-2 px-4 py-1.5 rounded-full text-body-sm font-medium capitalize sm:hidden ${STATUS_STYLES[claim.status]}`}
            >
              {claim.status}
            </span>
          </div>
        </div>

        {/* Desktop status + cancel button */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span
            className={`px-4 py-1.5 rounded-full text-body-sm font-medium capitalize ${STATUS_STYLES[claim.status]}`}
          >
            {claim.status}
          </span>

          <CancelClaimButton claim={claim} itemTitle={item.title} />
        </div>

        {/* Mobile cancel button */}
        <div className="sm:hidden shrink-0">
          <CancelClaimButton claim={claim} itemTitle={item.title} />
        </div>
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
        <div className="border border-border rounded-lg p-6 mt-6 bg-white">
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

          {item.postedBy?.phone && (
            <div className="mt-4">
              <label className="text-body-md font-medium text-text-primary">
                Phone Number
              </label>
              <div className="border border-border rounded-lg px-4 py-2.5 mt-1 text-body-md text-text-secondary">
                {item.postedBy.phone}
              </div>
            </div>
          )}

          {item.postedBy?.email && (
            <div className="mt-4">
              <label className="text-body-md font-medium text-text-primary">
                Email
              </label>
              <div className="border border-border rounded-lg px-4 py-2.5 mt-1 text-body-md text-text-secondary">
                {item.postedBy.email}
              </div>
            </div>
          )}

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
        <div className="border border-border rounded-lg p-8 mt-6 flex flex-col items-center text-center bg-white">
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
        <div className="border border-border rounded-lg p-8 mt-6 flex flex-col items-center text-center bg-white">
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
