import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { MapPin, Flag, XCircle } from "lucide-react";
import {
  getItemById,
  getClaimsForItem,
  getUserById,
  updateClaimStatus,
  updateItemStatus,
} from "../../services/api";

const STATUS_STYLES = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  declined: "bg-error/10 text-error",
};

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const PostClaims = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [claimsWithUsers, setClaimsWithUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Holds the claim currently pending confirmation in the "Accept the
  // Claim?" modal. null means the modal is closed.
  const [claimToConfirm, setClaimToConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getItemById(id), getClaimsForItem(id)])
      .then(async ([itemData, claimsData]) => {
        setItem(itemData);
        const withUsers = await Promise.all(
          claimsData.map(async (claim) => {
            const user = await getUserById(claim.userId);
            return { ...claim, claimant: user };
          }),
        );
        setClaimsWithUsers(withUsers);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Holds the claim currently pending confirmation in the "Decline the
  // Claim?" modal. null means the modal is closed.
  const [claimToDecline, setClaimToDecline] = useState(null);

  // Runs after the user confirms in the "Decline the Claim?" modal.
  const handleConfirmDecline = async () => {
    const claimId = claimToDecline;
    setUpdatingId(claimId);
    try {
      await updateClaimStatus(claimId, "declined");
      setClaimsWithUsers((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: "declined" } : c)),
      );
    } catch (err) {
      alert("Failed to update claim. Please try again.");
    } finally {
      setUpdatingId(null);
      setClaimToDecline(null);
    }
  };

  // Runs after the user confirms in the modal. Accepting has three effects:
  // 1. This claim becomes "accepted".
  // 2. Every OTHER still-pending claim on this item becomes "declined"
  //    (the item's been claimed, so competing claims are automatically closed).
  // 3. The item itself is marked resolved.
  //
  // NOTE: "Share your contact information with the accepted claims" (from
  // the confirmation modal) describes real-world/backend behavior — there's
  // no separate UI action needed here for it, since the claimant's own view
  // of the accepted claim already reveals postedBy info (see ClaimDetails.jsx).
  const handleConfirmAccept = async () => {
    const claimId = claimToConfirm;
    setUpdatingId(claimId);

    try {
      const otherPendingClaims = claimsWithUsers.filter(
        (c) => c.id !== claimId && c.status === "pending",
      );

      await Promise.all([
        updateClaimStatus(claimId, "accepted"),
        ...otherPendingClaims.map((c) => updateClaimStatus(c.id, "declined")),
        updateItemStatus(item.id, { resolved: true }),
      ]);

      navigate(`/account/posts/${item.id}/claims/${claimId}`);
    } catch (err) {
      alert("Failed to accept claim. Please try again.");
      setUpdatingId(null);
      setClaimToConfirm(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Item not found.</div>;

  const pendingCount = claimsWithUsers.filter(
    (c) => c.status === "pending",
  ).length;

  return (
    <div className="max-w-2xl relative">
      <h1 className="text-heading-1 font-bold text-text-primary">
        Claims Received
      </h1>
      <p className="text-body-md text-text-secondary mt-2">
        Manage claims for your posted Items.
      </p>

      {/* Item summary */}
      <div className="flex items-center gap-4 mt-6">
        <div className="w-24 h-24 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-label-sm shrink-0">
          Image
        </div>

        <div>
          <h2 className="text-heading-3 font-bold text-text-primary">
            {item.title}
          </h2>
          <p className="text-body-sm text-text-secondary mt-1">
            {formatDate(item.date)}
          </p>
          <div className="flex items-center gap-1 text-body-sm text-text-secondary mt-1">
            <MapPin size={14} />
            {item.location}
          </div>
          <span className="inline-block mt-2 px-3 py-1 rounded-full border border-error text-error text-body-sm">
            {claimsWithUsers.length} claims received
          </span>
        </div>
      </div>

      {/* Claims list */}
      <div className="flex flex-col gap-4 mt-8">
        {claimsWithUsers.map((claim) => (
          <div key={claim.id} className="border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-neutral-300 shrink-0" />
                <div>
                  <p className="text-heading-3 font-bold text-text-primary">
                    {claim.claimant.firstName} {claim.claimant.lastName}
                  </p>
                  <p className="text-body-md text-text-primary mt-1">
                    {claim.message}
                  </p>
                  <p className="text-body-sm text-text-secondary mt-1">
                    {formatDate(claim.claimedAt)}
                  </p>
                </div>
              </div>

              <span
                className={`px-4 py-1.5 rounded-full text-body-sm font-medium capitalize shrink-0 ${STATUS_STYLES[claim.status]}`}
              >
                {capitalize(claim.status)}
              </span>
            </div>

            {claim.status === "pending" && (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  disabled={updatingId === claim.id}
                  onClick={() => setClaimToDecline(claim.id)}
                  className="border border-border rounded-lg px-6 py-2 text-body-md text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                >
                  Decline
                </button>
                <button
                  type="button"
                  disabled={updatingId === claim.id}
                  onClick={() => setClaimToConfirm(claim.id)}
                  className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-2 text-body-md transition-colors disabled:opacity-50"
                >
                  Accept
                </button>
              </div>
            )}

            {claim.status === "accepted" && (
              <div className="flex justify-end mt-4">
                <Link
                  to={`/account/posts/${item.id}/claims/${claim.id}`}
                  className="border border-border rounded-lg px-6 py-2 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary transition-colors"
                >
                  View Contact Info
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Accept confirmation modal */}
      {claimToConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <Flag size={32} className="text-success" />
              <h2 className="text-heading-1 font-bold text-text-primary mt-3">
                Accept the Claim?
              </h2>
            </div>

            <div className="mt-6">
              <p className="text-body-md font-medium text-text-primary">
                Accepting the claim will
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-body-md text-text-primary">
                  <Flag size={16} className="text-success shrink-0" />
                  Mark the item as Resolved
                </li>
                <li className="flex items-center gap-2 text-body-md text-text-primary">
                  <Flag size={16} className="text-success shrink-0" />
                  Automatically decline other pending claims
                  {pendingCount > 1 && ` (${pendingCount - 1})`}
                </li>
                <li className="flex items-center gap-2 text-body-md text-text-primary">
                  <Flag size={16} className="text-success shrink-0" />
                  Share your contact information with the accepted claimant
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => setClaimToConfirm(null)}
                disabled={updatingId === claimToConfirm}
                className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                disabled={updatingId === claimToConfirm}
                className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-2.5 text-body-md transition-colors disabled:opacity-50"
              >
                {updatingId === claimToConfirm
                  ? "Accepting..."
                  : "Accept Claim"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline confirmation modal */}
      {claimToDecline && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <XCircle size={32} className="text-error" />
              <h2 className="text-heading-1 font-bold text-text-primary mt-3">
                Decline the Claim?
              </h2>
            </div>

            <div className="mt-6">
              <p className="text-body-md font-medium text-text-primary">
                Declining the claim will
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-body-md text-text-primary">
                  <XCircle size={16} className="text-error shrink-0" />
                  Notify the claimant that their claim was declined
                </li>
                <li className="flex items-center gap-2 text-body-md text-text-primary">
                  <XCircle size={16} className="text-error shrink-0" />
                  The item remains open, and other pending claims are unaffected
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => setClaimToDecline(null)}
                disabled={updatingId === claimToDecline}
                className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={updatingId === claimToDecline}
                className="bg-error hover:bg-error/90 text-text-inverse rounded-lg px-6 py-2.5 text-body-md transition-colors disabled:opacity-50"
              >
                {updatingId === claimToDecline
                  ? "Declining..."
                  : "Decline Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostClaims;
