import { useState, useEffect } from "react";
import { Link } from "react-router";
import { X, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { getCurrentUser, createClaim } from "../services/api";
import { useAuthStore } from "../store/authStore";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Shows an item's full details in a modal, with a "Claim" flow built in.
// "view" toggles between the details screen and the claim submission
// form, both inside the same modal shell rather than stacking a second
// modal on top.
const ItemDetailsModal = ({ item, onClose }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [view, setView] = useState("details"); // 'details' | 'claimForm' | 'claimSuccess'
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  console.log("ItemDetailsModal rendered, view =", view);
  // added for  fixing bug by chat
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🚨 BROWSER IS RELOADING");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
        .then((user) => setCurrentUserId(user.id))
        .catch((err) => console.error("Failed to load current user:", err));
    }
  }, [isAuthenticated]);

  // A user can't claim an item they posted themselves.
  const isOwnItem = currentUserId && item.userId === currentUserId;

  const handleSubmitClaim = async (e) => {
    console.log("handleSubmitClaim fired", e);
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please describe why this item belongs to you.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("about to call createClaim");
      await createClaim({
        itemId: item.id,
        userId: currentUserId,
        status: "pending",
        message: message.trim(),
        claimedAt: new Date().toISOString(),
      });
      console.log("createClaim succeeded, setting view to claimSuccess");
      setView("claimSuccess");
    } catch (err) {
      console.log("createClaim FAILED:", err);
      toast.error("Failed to submit claim. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ===== DETAILS VIEW ===== */}
        {view === "details" && (
          <>
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
              className={`inline-block mt-3 px-2 py-0.5 rounded text-label-sm font-medium ${
                item.status === "lost"
                  ? "bg-error/10 text-error"
                  : "bg-success/10 text-success"
              }`}
            >
              {item.status.toUpperCase()}
            </span>

            {/* Image placeholder — swap for the real item photo later */}
            <div className="w-full h-48 rounded-lg bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm mt-4">
              Image Placeholder
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
                <div className="flex items-center gap-1 text-body-md text-text-secondary mt-0.5">
                  <MapPin size={14} />
                  {item.location}
                </div>
              </div>
              <div>
                <p className="text-body-sm font-medium text-text-primary">
                  Colour
                </p>
                <p className="text-body-md text-text-secondary mt-0.5">
                  {item.color || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-body-sm font-medium text-text-primary">
                  Date
                </p>
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

            {/* Claim button logic:
                - Own item -> no button at all
                - Guest -> prompt to log in
                - Logged-in, someone else's item -> real Claim button */}
            {!isOwnItem && (
              <div className="flex justify-center mt-6">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => setView("claimForm")}
                    className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-10 py-2.5 text-body-md font-medium transition-colors"
                  >
                    Claim
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="text-body-md text-primary hover:underline"
                  >
                    Log in to claim this item
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* ===== CLAIM FORM VIEW ===== */}
        {view === "claimForm" && (
          <>
            <div className="flex items-start justify-between">
              <h2 className="text-heading-2 font-bold text-text-primary">
                Claim This Item
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="border border-border rounded-lg p-2 text-text-secondary hover:bg-background-subtle shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-body-sm text-text-secondary mt-2">
              Describe something specific about "{item.title}" that only the
              real owner would know, this helps the poster verify your claim.
            </p>

            <form onSubmit={handleSubmitClaim} className="mt-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="e.g., It has a small scratch on the back, and my name is written inside the front pocket."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-body-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setView("details")}
                  className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-2.5 text-body-md font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ===== SUCCESS VIEW ===== */}
        {view === "claimSuccess" && (
          <div className="flex flex-col items-center text-center py-4">
            <h2 className="text-heading-2 font-bold text-text-primary">
              Claim Submitted!
            </h2>
            <p className="text-body-md text-text-secondary mt-2">
              The poster will review your claim. You can track its status from
              My Claims.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-8 py-2.5 text-body-md font-medium mt-6 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailsModal;
