const DeleteUserModal = ({ userName, onCancel, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
    <div className="bg-background rounded-lg p-6 max-w-md w-full">
      <h2 className="text-heading-2 font-bold text-text-primary">
        Delete this account?
      </h2>
      <p className="text-body-md text-text-secondary mt-3">
        This will permanently remove{" "}
        {userName ? <strong>"{userName}"</strong> : "this user"}'s account,
        including all their posts and claims.
      </p>
      <div className="bg-warning/10 text-warning text-body-sm font-medium rounded-lg px-4 py-2.5 mt-4 text-center">
        This action can't be undone.
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="bg-error hover:bg-error/90 text-white rounded-lg px-6 py-2.5 text-body-md font-medium transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteUserModal;
