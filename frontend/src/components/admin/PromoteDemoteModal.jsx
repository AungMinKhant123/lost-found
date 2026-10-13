import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

// Shared confirmation for both promote and demote — action decides the
// wording/icon/button color, so there's one modal instead of two nearly
// identical ones.
const PromoteDemoteModal = ({
  userName,
  action,
  onCancel,
  onConfirm,
  isSubmitting,
}) => {
  const isPromote = action === "promote";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-background rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {isPromote ? (
            <ArrowUpCircle size={32} className="text-success" />
          ) : (
            <ArrowDownCircle size={32} className="text-warning" />
          )}
          <h2 className="text-heading-2 font-bold text-text-primary mt-3">
            {isPromote ? "Promote to Admin?" : "Demote to User?"}
          </h2>
        </div>

        <p className="text-body-md text-text-secondary mt-3 text-center">
          {isPromote ? (
            <>
              <strong className="text-text-primary">{userName}</strong> will
              gain access to the Admin Panel, including managing listings,
              attributes, and other users.
            </>
          ) : (
            <>
              <strong className="text-text-primary">{userName}</strong> will
              lose access to the Admin Panel and go back to a regular user
              account.
            </>
          )}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`rounded-lg px-6 py-2.5 text-body-md font-medium text-white transition-colors disabled:opacity-50 ${
              isPromote
                ? "bg-success hover:bg-success/90"
                : "bg-warning hover:bg-warning/90"
            }`}
          >
            {isSubmitting
              ? isPromote
                ? "Promoting..."
                : "Demoting..."
              : isPromote
                ? "Promote"
                : "Demote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteDemoteModal;
