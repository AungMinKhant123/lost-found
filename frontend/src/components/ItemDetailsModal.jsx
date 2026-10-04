import { useState } from "react";
import { Link } from "react-router";
import { X, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/authStore";
import { useItem } from "../hooks/useItem";
import { useCreateClaim } from "../hooks/useCreateClaim";

import ImageCarousel from "./ImageCarousel";

import { useMyPosts } from "../hooks/useMyPosts";

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

const ItemDetailsModal = ({ itemId, onClose, allowClaim = true }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // The real backend's item response has no owner field at all, so we
  // can't just compare item.userId against the logged-in user. Instead,
  // we check whether this item shows up in the viewer's OWN posts list
  // (an endpoint that already works) — if it does, it's their post.
  const { data: myPostsData } = useMyPosts({}, { enabled: isAuthenticated });
  const isOwnItem =
    isAuthenticated &&
    (myPostsData?.data ?? []).some((post) => post.id === itemId);
  const currentUser = useAuthStore((state) => state.user);

  const [view, setView] = useState("details");
  const [message, setMessage] = useState("");

  // =========================
  // GET ITEM
  // =========================

  const { data: item, isLoading, isError, error } = useItem(itemId);

  // =========================
  // CREATE CLAIM
  // =========================

  const createClaimMutation = useCreateClaim();

  const handleSubmitClaim = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please describe why this item belongs to you.");
      return;
    }

    createClaimMutation.mutate(
      {
        itemId,
        message: message.trim(),
      },
      {
        onSuccess: () => {
          setView("claimSuccess");
          setMessage("");
        },

        onError: (err) => {
          toast.error(
            err?.response?.data?.message ||
              (err?.friendly
                ? err.message
                : "Failed to submit claim. Please try again."),
          );
        },
      },
    );
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 font-bold text-text-primary">
              Loading...
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="border border-border rounded-lg p-2 text-text-secondary hover:bg-background-subtle"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex justify-center py-12">
            <p className="text-body-md text-text-secondary">
              Loading item details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start justify-between">
            <h2 className="text-heading-2 font-bold text-text-primary">
              Unable to load item
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="border border-border rounded-lg p-2 text-text-secondary hover:bg-background-subtle"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-body-md text-text-secondary mt-4">
            {error?.friendly
              ? error.message
              : "Failed to load item details. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  // =========================
  // ITEM STATUS
  // =========================

  const isResolved = item.status === "RESOLVED";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-hidden">
        {/* =====================================================
            DETAILS VIEW
        ====================================================== */}

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

            {/* Status */}

            <span
              className={`inline-block mt-3 px-2 py-0.5 rounded text-label-sm font-medium ${
                isResolved
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {capitalize(item.status)}
            </span>

            {/* =================================================
                IMAGE
            ================================================== */}

            <ImageCarousel
              images={(item.images || []).map((img) => img.imageUrl || img)}
            />

            {/* =================================================
                ITEM INFORMATION
            ================================================== */}

            <div className="grid grid-cols-2 gap-4 mt-5">
              {/* Category */}

              <div>
                <p className="text-body-sm font-medium text-text-primary">
                  Category
                </p>

                <p className="text-body-md text-text-secondary mt-0.5">
                  {item.category?.name || "N/A"}
                </p>
              </div>

              {/* Location */}

              <div>
                <p className="text-body-sm font-medium text-text-primary">
                  Location
                </p>

                <div className="flex items-center gap-1 text-body-md text-text-secondary mt-0.5">
                  <MapPin size={14} />
                  {item.location}
                </div>
              </div>

              {/* Colour */}

              <div>
                <p className="text-body-sm font-medium text-text-primary">
                  Colour
                </p>

                <p className="text-body-md text-text-secondary mt-0.5">
                  {item.color?.name || "N/A"}
                </p>
              </div>

              {/* Date */}

              <div>
                <p className="text-body-sm font-medium text-text-primary">
                  Date
                </p>

                <p className="text-body-md text-text-secondary mt-0.5">
                  {formatDate(item.dateLostOrFound)}
                </p>
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            {item.description && (
              <p className="text-body-md text-text-primary mt-5">
                {item.description}
              </p>
            )}

            {/* =================================================
                RESOLVED MESSAGE
            ================================================== */}

            {isResolved && (
              <p className="text-center text-body-sm text-text-secondary mt-6">
                This item has been resolved, so it can't be claimed anymore.
                Contact admin if there are any disputes.
              </p>
            )}

            {/* =================================================
                CLAIM BUTTON
            ================================================== */}

            {isOwnItem && !isResolved && (
              <p className="text-center text-body-sm text-text-secondary mt-6">
                This is your own post, so you can't claim it.
              </p>
            )}

            {allowClaim && !isResolved && !isOwnItem && (
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

        {/* =====================================================
            CLAIM FORM VIEW
        ====================================================== */}

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
              real owner would know. This helps the poster verify your claim.
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
                  disabled={createClaimMutation.isPending}
                  className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-2.5 text-body-md font-medium transition-colors disabled:opacity-50"
                >
                  {createClaimMutation.isPending
                    ? "Submitting..."
                    : "Submit Claim"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* =====================================================
            SUCCESS VIEW
        ====================================================== */}

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
