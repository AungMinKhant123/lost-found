import { X, Trash2 } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CLAIM_STATUS_STYLES = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  declined: "bg-error/10 text-error",
};

const UserDetailsModal = ({ details, onClose, onDeleteClick }) => {
  if (!details) return null;
  const { user, items, claims } = details;
  const isSuperAdmin = user.role === "superadmin";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto admin-scrollbar">
        <div className="flex items-start justify-between">
          <h2 className="text-heading-2 font-bold text-text-primary">
            {user.firstName} {user.lastName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="border border-border rounded-lg p-2 text-text-secondary hover:bg-background-subtle shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <span className="inline-block mt-2 px-3 py-1 rounded-full text-label-sm font-medium bg-primary/15 text-primary capitalize">
          {user.role || "user"}
        </span>

        <h3 className="text-heading-3 font-bold text-text-primary mt-6">
          Personal Information
        </h3>
        <div className="border border-border rounded-lg p-4 mt-2 space-y-1">
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Email</span>
            <span className="text-text-primary">{user.email}</span>
          </div>
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Phone</span>
            <span className="text-text-primary">{user.phone || "N/A"}</span>
          </div>
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Profession</span>
            <span className="text-text-primary">
              {user.profession || "N/A"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="border border-border rounded-lg p-3 text-center">
            <p className="text-heading-3 font-bold text-text-primary">
              {items.length}
            </p>
            <p className="text-body-sm text-text-secondary">Posts</p>
          </div>
          <div className="border border-border rounded-lg p-3 text-center">
            <p className="text-heading-3 font-bold text-text-primary">
              {claims.length}
            </p>
            <p className="text-body-sm text-text-secondary">Claims</p>
          </div>
        </div>

        <h3 className="text-heading-3 font-bold text-text-primary mt-6">
          Posted Items ({items.length})
        </h3>
        <div className="flex flex-col gap-2 mt-2">
          {items.length === 0 && (
            <p className="text-body-sm text-text-secondary">No posts yet.</p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-body-md font-medium text-text-primary">
                  {item.title}
                </p>
                <p className="text-label-sm text-text-secondary">
                  {item.location} · {formatDate(item.date)}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-label-sm font-medium ${
                  item.resolved
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {item.resolved ? "Resolved" : "Open"}
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-heading-3 font-bold text-text-primary mt-6">
          Claim History ({claims.length})
        </h3>
        <div className="flex flex-col gap-2 mt-2">
          {claims.length === 0 && (
            <p className="text-body-sm text-text-secondary">No claims made.</p>
          )}
          {claims.map((claim) => (
            <div key={claim.id} className="border border-border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <p className="text-body-md font-medium text-text-primary">
                  {claim.itemTitle}
                </p>
                <span
                  className={`px-2 py-0.5 rounded-full text-label-sm font-medium capitalize ${CLAIM_STATUS_STYLES[claim.status]}`}
                >
                  {claim.status}
                </span>
              </div>
              <p className="text-body-sm text-text-secondary mt-1">
                "{claim.message}"
              </p>
            </div>
          ))}
        </div>

        {!isSuperAdmin && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={onDeleteClick}
              className="flex items-center gap-2 bg-error hover:bg-error/90 text-white rounded-lg px-8 py-2.5 text-body-md font-medium transition-colors"
            >
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;
