import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Upload, ChevronDown, Calendar, X, FileCheck } from "lucide-react";
import {
  Smartphone,
  ShoppingBag,
  Shirt,
  Watch,
  Key,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { getCurrentUser, createItemWithSequentialId } from "../../services/api";

const CATEGORIES = [
  { label: "Electronics", icon: Smartphone },
  { label: "Bags", icon: ShoppingBag },
  { label: "Clothing", icon: Shirt },
  { label: "Accessories", icon: Watch },
  { label: "Keys", icon: Key },
  { label: "Documents", icon: FileText },
  { label: "Other", icon: MoreHorizontal },
];

const COLORS = [
  { name: "Black", hex: "#1F2933" },
  { name: "Brown", hex: "#8B5E3C" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Blue", hex: "#2F80ED" },
  { name: "Red", hex: "#EB5757" },
];

const NewPost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    status: "lost",
    title: "",
    category: "",
    location: "",
    color: "",
    date: "",
    description: "",
    contactName: "",
    contactEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controls the "are you sure?" confirmation modal — separate from
  // isSubmitting, since the modal can be open WITHOUT a request in
  // flight (waiting on the user to click Confirm).
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const categoryRef = useRef(null);
  const colorRef = useRef(null);

  // LOCAL PREVIEW ONLY — see note further down where these are rendered.
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setFormData((prev) => ({
        ...prev,
        contactName: `${user.firstName} ${user.lastName}`,
        contactEmail: user.email,
      }));
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(e.target)) {
        setIsColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const newPreviews = fileArray.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (id) => {
    setImagePreviews((prev) => prev.filter((preview) => preview.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Item title is required.";
    if (!formData.category) newErrors.category = "Please choose a category.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.date) newErrors.date = "Please select a date.";
    if (!formData.description.trim())
      newErrors.description = "Please add a description.";
    return newErrors;
  };

  // Form submit now just VALIDATES and opens the confirmation modal —
  // it does NOT create the post yet. The actual creation only happens
  // in handleConfirmSubmit, after the user explicitly confirms.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setShowConfirmModal(true);
  };

  // Runs when the user clicks "Confirm" in the modal — this is where
  // the item actually gets created.
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = await getCurrentUser();

      await createItemWithSequentialId({
        title: formData.title,
        status: formData.status,
        category: formData.category,
        color: formData.color,
        location: formData.location,
        date: formData.date,
        description: formData.description,
        resolved: false,
        userId: user.id,
        postedBy: {
          name: formData.contactName,
          email: formData.contactEmail,
        },
      });

      toast.success("Your post has been listed.");
      navigate("/account/posts");
    } catch (err) {
      toast.error("Failed to create post. Please try again.");
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl border border-border rounded-lg p-8 relative">
      <h1 className="text-heading-1 font-bold text-primary-dark">
        Create New Post
      </h1>
      <p className="text-body-sm text-text-secondary mt-2">
        Fill out the details below to publish your lost or found item. Giving
        accurate descriptions increases recovery success!
      </p>

      <form onSubmit={handleFormSubmit} className="mt-6 space-y-5" noValidate>
        {/* Lost/Found toggle */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            What type of post is this?
          </label>
          <div className="flex border border-border rounded-lg overflow-hidden mt-2">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, status: "lost" }))
              }
              className={`flex-1 py-2.5 text-body-md font-medium transition-colors ${
                formData.status === "lost"
                  ? "bg-primary text-text-inverse"
                  : "bg-background text-text-primary hover:bg-background-subtle"
              }`}
            >
              Lost Item
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, status: "found" }))
              }
              className={`flex-1 py-2.5 text-body-md font-medium transition-colors ${
                formData.status === "found"
                  ? "bg-primary text-text-inverse"
                  : "bg-background text-text-primary hover:bg-background-subtle"
              }`}
            >
              Found Item
            </button>
          </div>
        </div>

        {/* Item Title */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            Item Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., iPhone 13 Pro with blue leather case"
            className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && (
            <p className="text-error text-label-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            Category
          </label>
          <div className="relative mt-1" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen((v) => !v)}
              className="w-full flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-body-md text-left focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span
                className={
                  formData.category
                    ? "text-text-primary"
                    : "text-text-secondary"
                }
              >
                {formData.category || "Choose your Item Category"}
              </span>
              <ChevronDown
                size={18}
                className={`text-text-secondary transition-transform ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isCategoryOpen && (
              <ul className="absolute z-10 w-full mt-1 border border-border rounded-lg bg-surface shadow-lg overflow-hidden">
                {CATEGORIES.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, category: label }));
                        setIsCategoryOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse"
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.category && (
            <p className="text-error text-label-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="eg. school entrance"
            className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.location && (
            <p className="text-error text-label-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Colour */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            Colour
          </label>
          <div className="relative mt-1" ref={colorRef}>
            <button
              type="button"
              onClick={() => setIsColorOpen((v) => !v)}
              className="w-full flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-body-md text-left focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span
                className={
                  formData.color ? "text-text-primary" : "text-text-secondary"
                }
              >
                {formData.color || "Colour"}
              </span>
              <ChevronDown
                size={18}
                className={`text-text-secondary transition-transform ${
                  isColorOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isColorOpen && (
              <ul className="absolute z-10 w-full mt-1 border border-border rounded-lg bg-surface shadow-lg overflow-hidden">
                {COLORS.map((color) => (
                  <li key={color.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, color: color.name }));
                        setIsColorOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-border shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date Lost/Found */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            Date Lost/Found
          </label>
          <div className="relative mt-1">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
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

        {/* Description */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            Detailed Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Please share distinguishing features, unique stickers, wear & tear, or specific settings where the item was last spotted..."
            className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.description && (
            <p className="text-error text-label-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* Upload Images — LOCAL PREVIEW ONLY. json-server has no real
            file storage, so these object URLs exist purely for display
            in this browser tab; nothing about the actual image data is
            saved when the post is submitted. This is a known limitation
            until real image storage exists on the backend. */}
        <div>
          <label className="text-body-md font-medium text-text-primary">
            Upload Images
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 mt-1 flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-full bg-background-subtle flex items-center justify-center">
              <Upload size={18} className="text-text-secondary" />
            </div>
            <p className="text-body-md text-text-primary mt-3">
              Drag and drop your files here, or{" "}
              <label className="text-primary underline cursor-pointer">
                browse
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-body-sm text-text-secondary mt-1">
              Supports JPG, PNG up to 10MB each
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {imagePreviews.map((preview) => (
                <div key={preview.id} className="relative w-20 h-20">
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-full rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(preview.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/90"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-heading-3 font-bold text-primary-dark">
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-body-sm font-medium text-text-primary">
                Your Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-body-sm font-medium text-text-primary">
                Email Address
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-3 py-2.5 mt-1 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate("/account/posts")}
            className="border border-border rounded-lg px-8 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-8 py-2.5 text-body-md font-medium transition-colors"
          >
            Submit Post
          </button>
        </div>
      </form>

      {/* Confirmation modal — appears after clicking Submit Post, before
          anything actually gets created. Matches the same modal design
          pattern used for Accept/Decline Claim in PostClaims.jsx. */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <FileCheck size={32} className="text-primary" />
              <h2 className="text-heading-1 font-bold text-text-primary mt-3">
                Confirm Your Post
              </h2>
              <p className="text-body-md text-text-secondary mt-2">
                Is the information you submitted accurate? You can review it
                once more before it goes live.
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="border border-border rounded-lg px-6 py-2.5 text-body-md text-text-primary hover:bg-background-subtle transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-2.5 text-body-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPost;
