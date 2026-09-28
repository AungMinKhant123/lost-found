const DeleteConfirmModal = ({
  isOpen,
  item,
  itemCount,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="bg-background rounded-lg border border-border w-full max-w-md p-6 shadow-lg">
        <h2 className="text-heading-2 font-bold text-text-primary">
          Delete this value?
        </h2>

        <p className="mt-3 text-body-md text-text-secondary">
          "{item.name}" is currently used by{" "}
          <strong className="text-text-primary">{itemCount}</strong>{" "}
          {itemCount === 1 ? "item" : "items"}.
        </p>

        <div className="mt-4 rounded-lg bg-warning/10 px-4 py-3 text-center text-body-sm font-medium text-text-primary">
          Those items will be reassigned to "Other" automatically - they won't
          be deleted.
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-border px-6 py-2.5 text-body-md text-text-primary transition-colors hover:bg-background-subtle disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-error px-6 py-2.5 text-body-md font-medium text-white transition-colors hover:bg-error/90 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete & Reassign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
