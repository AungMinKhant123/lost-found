import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronDown, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { getProfile } from "../../api/authApi";
import { getMyPostForEdit } from "../../api/itemsApi";
import {
  getCurrentUser,
  getItemById,
} from "../../services/api";
import { useAttributes } from "../../hooks/useAttributes";
import { useUpdateMyPost } from "../../hooks/useUpdateMyPost";
import { getCategoryIcon } from "../../utils/categoryIcons";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function getMyPostForEditWithFallback(itemId) {
  try {
    return await getMyPostForEdit(itemId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getItemById(itemId);
    }
    throw error;
  }
}

async function getProfileWithFallback() {
  try {
    return await getProfile();
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getCurrentUser();
    }
    throw error;
  }
}

// A styled dropdown, same look as the ones on New Post. Each option can
// show an icon (categories) or a colour swatch (colours).
const PickerField = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  return (
    <div>
      <label className="text-body-md font-medium text-text-primary">
        {label}
      </label>
      <div className="relative mt-1" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-body-md text-left focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className={value ? "text-text-primary" : "text-text-secondary"}>
            {selected?.label || value || placeholder}
          </span>
          <ChevronDown
            size={18}
            className={`text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 border border-border rounded-lg bg-surface shadow-lg overflow-hidden max-h-64 overflow-y-auto admin-scrollbar">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse"
                >
                  {option.Icon && <option.Icon size={16} />}
                  {option.hex && (
                    <span
                      className="w-4 h-4 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: option.hex }}
                    />
                  )}
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-error text-label-sm mt-1">{error}</p>}
    </div>
  );
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, colors } = useAttributes();
  const updateMutation = useUpdateMyPost();

  const [item, setItem] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    color: "",
    date: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // Load the post and the current user together, then fill the form.
  useEffect(() => {
    Promise.all([getMyPostForEditWithFallback(id), getProfileWithFallback()])
      .then(([itemData, user]) => {
        const category =
          typeof itemData.category === "string"
            ? itemData.category
            : itemData.category?.name || "";
        const color =
          typeof itemData.color === "string"
            ? itemData.color
            : itemData.color?.name || "";
        const date = itemData.date || itemData.dateLostOrFound || "";

        setItem({
          ...itemData,
          userId: itemData.userId || user.id,
          resolved: itemData.resolved ?? itemData.status === "RESOLVED",
          status:
            itemData.type === "LOST"
              ? "lost"
              : itemData.type === "FOUND"
                ? "found"
                : itemData.status,
        });
        setCurrentUserId(user.id);
        setForm({
          title: itemData.title || "",
          category,
          location: itemData.location || "",
          color,
          date: date.slice(0, 10),
          description: itemData.description || "",
        });
      })
      .catch(() => setLoadError("We couldn't find this post."))
      .finally(() => setLoading(false));
  }, [id]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Item title is required.";
    if (!form.category) next.category = "Please choose a category.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.date) next.date = "Please select a date.";
    if (!form.description.trim())
      next.description = "Please add a description.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const category = categories.find((option) => option.name === form.category);
    const color = colors.find((option) => option.name === form.color);

    if (!category || (form.color && !color)) {
      toast.error("Please choose a valid category and colour.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        itemId: id,
        updates: {
          title: form.title.trim(),
          categoryId: category.id,
          ...(color ? { colorId: color.id } : {}),
          location: form.location.trim(),
          dateLostOrFound: form.date,
          description: form.description.trim(),
        },
        mockUpdates: {
          title: form.title.trim(),
          category: form.category,
          ...(form.color ? { color: form.color } : {}),
          location: form.location.trim(),
          date: form.date,
          description: form.description.trim(),
        },
      });
      toast.success("Post updated.");
      navigate(`/account/posts/${id}`);
    } catch (err) {
      toast.error(
        err.friendly
          ? err.message
          : err.response?.data?.message ??
              "Couldn't save your changes. Please try again.",
      );
    }
  };

  // Shown instead of the form when the post can't be edited.
  const notice = (message) => (
    <div className="max-w-2xl border border-border rounded-lg p-8 text-center">
      <p className="text-body-md text-text-primary">{message}</p>
      <Link
        to="/account/posts"
        className="inline-block mt-4 text-body-md text-primary hover:underline"
      >
        Back to My Posts
      </Link>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (loadError || !item)
    return notice(loadError || "We couldn't find this post.");
  if (item.userId !== currentUserId)
    return notice("You can only edit your own posts.");
  if (item.resolved) return notice("Resolved posts can't be edited.");

  const categoryOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
    Icon: getCategoryIcon(c.icon),
  }));
  const colourOptions = colors.map((c) => ({
    value: c.name,
    label: c.name,
    hex: c.hex,
  }));

  return (
    <div className="max-w-2xl border border-border rounded-lg p-8">
      <h1 className="text-heading-1 font-bold text-primary-dark">Edit Post</h1>
      <p className="text-body-sm text-text-secondary mt-2">
        Update the details of your post. Accurate descriptions help people
        recognise their item.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {/* The type is fixed once a post is published. */}
        <div>
          <p className="text-body-md font-medium text-text-primary">
            Post type
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded text-label-md font-medium ${
              item.status === "lost"
                ? "bg-error/10 text-error"
                : "bg-success/10 text-success"
            }`}
          >
            {item.status === "lost" ? "Lost Item" : "Found Item"}
          </span>
          <p className="text-label-sm text-text-secondary mt-1">
            The type can't be changed after a post is published.
          </p>
        </div>

        <div>
          <label className="text-body-md font-medium text-text-primary">
            Item Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            maxLength={100}
            className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && (
            <p className="text-error text-label-sm mt-1">{errors.title}</p>
          )}
        </div>

        <PickerField
          label="Category"
          value={form.category}
          placeholder="Choose your Item Category"
          options={categoryOptions}
          onChange={(value) => setField("category", value)}
          error={errors.category}
        />

        <div>
          <label className="text-body-md font-medium text-text-primary">
            Location
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.location && (
            <p className="text-error text-label-sm mt-1">{errors.location}</p>
          )}
        </div>

        <PickerField
          label="Colour"
          value={form.color}
          placeholder="Colour"
          options={colourOptions}
          onChange={(value) => setField("color", value)}
        />

        <div>
          <label className="text-body-md font-medium text-text-primary">
            Date Lost/Found
          </label>
          <div className="relative mt-1">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className="w-full border border-border rounded-lg pl-3 pr-10 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Calendar
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            />
          </div>
          {errors.date && (
            <p className="text-error text-label-sm mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="text-body-md font-medium text-text-primary">
            Detailed Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.description && (
            <p className="text-error text-label-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <Link
            to={`/account/posts/${id}`}
            className="border border-border rounded-lg px-8 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-8 py-2.5 text-body-md font-medium transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
