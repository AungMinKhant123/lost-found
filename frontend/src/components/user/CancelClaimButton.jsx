import { useState } from "react";
import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { cancelClaim } from "../../services/api";

// Small delete icon for the claimant, shown on the Claim Details page.
// Renders nothing unless the claim is still pending.
const CancelClaimButton = ({ claim, itemTitle }) => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (claim.status !== "pending") return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await cancelClaim(claim.id);
      toast.success("Claim deleted.");
      navigate("/account/claims");
    } catch (err) {
      toast.error(
        err.friendly
          ? err.message
          : "Couldn't delete this claim. Please try again.",
      );
      setIsConfirming(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        title="Delete claim"
        aria-label="Delete claim"
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-border text-text-primary transition-colors hover:bg-error/10 hover:text-error hover:border-error"
      >
        <Trash2 size={18} />
      </button>

      {isConfirming && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setIsConfirming(false);
            }
          }}
        >
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h2 className="text-heading-2 font-bold text-text-primary">
              Delete this claim?
            </h2>
            <p className="text-body-md text-text-secondary mt-3">
              This will withdraw your claim on{" "}
              {itemTitle ? <strong>"{itemTitle}"</strong> : "this item"} and
              remove it. The poster will no longer see it.
            </p>

            <div className="bg-warning/10 text-warning text-body-sm font-medium rounded-lg px-4 py-2.5 mt-4 text-center">
              This action can't be undone.
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                disabled={isDeleting}
                className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors disabled:opacity-50"
              >
                Keep Claim
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="bg-error hover:bg-error/90 text-white rounded-lg px-6 py-2.5 text-body-md font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CancelClaimButton;
