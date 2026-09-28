import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deletePost, getCurrentUser } from "../../services/api";
import ConfirmDeleteModal from "../admin/ConfirmDeleteModal";

// Small edit + delete icon buttons for a post's OWNER, shown on the
// "Claims Received" page. Renders nothing for anyone else.
const PostActions = ({ item }) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setCurrentUserId(user.id))
      .catch((err) => console.error("Failed to load current user:", err));
  }, []);

  if (!currentUserId || item.userId !== currentUserId) return null;

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
        {item.resolved ? (
          // Resolved posts are locked, so the edit icon is greyed out.
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
