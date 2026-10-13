import { Eye, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const UserRow = ({ user, onView, onDelete, onPromote, onDemote }) => {
  const isSuperAdmin = user.role === "SUPERADMIN";
  const isAdmin = isSuperAdmin || user.role === "admin";

  return (
    <div className="flex items-center gap-3.5 px-2 py-2 border-b border-border/40 last:border-b-0 hover:bg-neutral-50/50 rounded-lg transition-colors">
      <div className="w-9 h-9 rounded-full bg-neutral-300 shrink-0 flex items-center justify-center text-body-sm font-bold text-white uppercase">
        {user.firstName?.charAt(0) || "?"}
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-body-md font-semibold text-text-primary">
          {user.firstName} {user.lastName}
          {isSuperAdmin && (
            <span className="ml-2 text-label-sm font-medium text-primary">
              Super Admin
            </span>
          )}
        </p>
        <p className="truncate text-body-sm text-text-secondary">
          {user.email}
        </p>
      </div>

      <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-body-sm text-text-primary">
        {user.postsCount} posts
      </span>
      <span className="shrink-0 rounded-full bg-info/15 px-3 py-1 text-body-sm text-text-primary mr-2">
        {user.claimsCount} claims
      </span>

      {!isSuperAdmin &&
        (isAdmin ? (
          <button
            type="button"
            onClick={onDemote}
            title="Demote to User"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-border-strong text-text-primary transition-colors hover:bg-warning/10 hover:text-warning"
          >
            <ArrowDownCircle size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onPromote}
            title="Promote to Admin"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-border-strong text-text-primary transition-colors hover:bg-success/10 hover:text-success"
          >
            <ArrowUpCircle size={18} />
          </button>
        ))}

      <button
        type="button"
        onClick={onDelete}
        disabled={isSuperAdmin}
        title={
          isSuperAdmin
            ? "Super Admin accounts can't be deleted"
            : "Delete account"
        }
        className="w-9 h-9 flex items-center justify-center rounded-md border border-border-strong text-text-primary transition-colors hover:bg-error/10 hover:text-error disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-primary"
      >
        <Trash2 size={18} />
      </button>

      <button
        type="button"
        onClick={onView}
        title="View details"
        className="w-9 h-9 flex items-center justify-center rounded-md border border-border-strong text-text-primary transition-colors hover:bg-background-subtle hover:text-primary"
      >
        <Eye size={18} />
      </button>
    </div>
  );
};

export default UserRow;
