import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deletePost } from "../../services/api";
import ConfirmDeleteModal from "../admin/ConfirmDeleteModal";

// Edit + delete icon buttons, shown on "Claims Received" (PostClaims.jsx).
// No ownership check here: this component only ever renders on a page
// you can only reach by opening one of YOUR OWN posts from My Posts, and
// the real backend's response for this page has no owner field to check
// against anyway. If PostActions is ever reused somewhere items from
// OTHER users can appear, this needs a real ownership check added back.
const PostActions = ({ item }) => {
  const navigate = useNavigate();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(item.id);
      toast.success("Post deleted.");
      navigate("/account/posts");
    } catch (err) {
      toast.error(
        err.friendly
          ? err.message
          : "Couldn't delete this post. Please try again.",
      );
      setConfirmingDelete(false);
      setIsDeleting(false);
    }
  };

  const iconButton =
    "w-9 h-9 flex items-center justify-center rounded-lg border border-border transition-colors";

  return (
    <>
      <div className="flex items-center gap-2">
        {item.resolved || item.status === "RESOLVED" ? (
          <span
            title="Resolved posts can't be edited"
            aria-disabled="true"
            className={`${iconButton} text-text-secondary opacity-40 cursor-not-allowed`}
          >
            <Pencil size={18} />
          </span>
        ) : (
          <Link
            to={`/account/posts/${item.id}/edit`}
            title="Edit post"
            aria-label="Edit post"
            className={`${iconButton} text-text-primary hover:bg-background-subtle hover:text-primary`}
          >
            <Pencil size={18} />
          </Link>
        )}

        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          title="Delete post"
          aria-label="Delete post"
          className={`${iconButton} text-text-primary hover:bg-error/10 hover:text-error hover:border-error`}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmDeleteModal
          itemTitle={item.title}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default PostActions;
