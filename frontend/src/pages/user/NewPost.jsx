import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ImagePlus,
  MapPin,
  Palette,
  Tag,
  Upload,
  User,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getCurrentUser } from "../../services/api";
import { useAttributes } from "../../hooks/useAttributes";
import { useCreateItem } from "../../hooks/useItems";
import { useNavigate } from "react-router";

export default function NewPost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    categories,
    colors,
    loading: attributesLoading,
    error: attributesError,
  } = useAttributes();

  const createItemMutation = useCreateItem();

  const [formData, setFormData] = useState({
    type: "LOST",
    title: "",
    categoryId: "",
    location: "",
    colorId: "",
    dateLostOrFound: "",
    description: "",
    contactName: "",
    contactEmail: "",
  });

  const [images, setImages] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  // --------------------------------------------------
  // Validation state
  // --------------------------------------------------

  const [errors, setErrors] = useState({});

  // --------------------------------------------------
  // Load current authenticated user
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const user = await getCurrentUser();

        if (!mounted || !user) {
          return;
        }

        setFormData((prev) => ({
          ...prev,
          contactName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          contactEmail: user.email ?? "",
        }));
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Cleanup preview URLs when component unmounts
  // --------------------------------------------------

  const imagesRef = useRef([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, []);

  // --------------------------------------------------
  // Handle normal input changes
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts correcting it
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // --------------------------------------------------
  // Select item type
  // --------------------------------------------------

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));
  };

  // --------------------------------------------------
  // Select category
  // Store ID, display name
  // --------------------------------------------------

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category.id,
    }));

    setErrors((prev) => ({
      ...prev,
      categoryId: "",
    }));

    setCategoryOpen(false);
  };

  // --------------------------------------------------
  // Select color
  // Store ID, display name
  // --------------------------------------------------

  const handleColorSelect = (color) => {
    setFormData((prev) => ({
      ...prev,
      colorId: color.id,
    }));

    setErrors((prev) => ({
      ...prev,
      colorId: "",
    }));

    setColorOpen(false);
  };

  // --------------------------------------------------
  // Image selection
  // --------------------------------------------------

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingSlots = 5 - images.length;

    if (remainingSlots <= 0) {
      toast.error("You can upload up to 5 images.");
      event.target.value = "";
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    if (selectedFiles.length > remainingSlots) {
      toast.error(`You can upload up to 5 images.`);
    }

    const newImages = filesToAdd.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Allow selecting the same file again later
    event.target.value = "";
  };

  // --------------------------------------------------
  // Remove image
  // --------------------------------------------------

  const handleRemoveImage = (imageId) => {
    setImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return prev.filter((image) => image.id !== imageId);
    });
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please enter an item title.";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please choose a category.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Please enter the location.";
    }

    if (!formData.colorId) {
      newErrors.colorId = "Please choose a color.";
    }

    if (!formData.dateLostOrFound) {
      newErrors.dateLostOrFound = "Please select a date.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please describe the item.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // Open confirmation modal
  // --------------------------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete all required fields.");
      return;
    }

    setShowConfirmModal(true);
  };

  // --------------------------------------------------
  // Submit to backend
  // --------------------------------------------------

  const handleConfirmSubmit = async () => {
    if (createItemMutation.isPending) {
      return;
    }

    try {
      const data = new FormData();

      data.append("type", formData.type);
      data.append("title", formData.title.trim());
      data.append("categoryId", formData.categoryId);
      data.append("location", formData.location.trim());
      data.append("colorId", formData.colorId);
      data.append("dateLostOrFound", formData.dateLostOrFound);
      data.append("description", formData.description.trim());

      // Add every selected image using the same field name.
      //
      // Backend:
      // request.parts()
      //   -> part.type === "file"
      //   -> part.fieldname === "images"
      //
      images.forEach((image) => {
        data.append("images", image.file);
      });

      await createItemMutation.mutateAsync(data);

      toast.success(
        formData.type === "LOST"
          ? "Lost item posted successfully!"
          : "Found item posted successfully!",
      );

      setShowConfirmModal(false);

      navigate("/account/posts");
    } catch (error) {
      console.error("Failed to create item:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create item. Please try again.";

      toast.error(message);
    }
  };

  // --------------------------------------------------
  // Selected category / color for display
  // --------------------------------------------------

  const selectedCategory = categories.find(
    (category) => category.id === formData.categoryId,
  );

  const selectedColor = colors.find((color) => color.id === formData.colorId);

  // --------------------------------------------------
  // Loading / attribute error
  // --------------------------------------------------

  if (attributesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (attributesError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Failed to load categories and colors.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-black text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --------------------------------------------- */}
      {/* Header                                        */}
      {/* --------------------------------------------- */}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* Main content                                  */}
      {/* --------------------------------------------- */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create a New Post
          </h1>

          <p className="mt-2 text-gray-600">
            Report a lost or found item and help reconnect it with its owner.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* ----------------------------------------- */}
            {/* Lost / Found                               */}
            {/* ----------------------------------------- */}

            <div className="p-6 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Post Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("LOST")}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    formData.type === "LOST"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.type === "LOST"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <MapPin size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">Lost</p>
                      <p className="text-sm text-gray-500">I lost this item</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("FOUND")}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    formData.type === "FOUND"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.type === "FOUND"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Check size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">Found</p>
                      <p className="text-sm text-gray-500">I found this item</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* ----------------------------------------- */}
            {/* Form fields                                */}
            {/* ----------------------------------------- */}

            <div className="p-6 space-y-6">
              {/* Title */}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Item Title <span className="text-red-500">*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Black iPhone 15"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-black/10`}
                />

                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Category + Color */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setCategoryOpen((prev) => !prev);
                      setColorOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    } flex items-center justify-between text-left bg-white`}
                  >
                    <div className="flex items-center gap-3">
                      <Tag size={18} className="text-gray-500" />

                      <span
                        className={
                          selectedCategory ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {selectedCategory?.name || "Choose your Item Category"}
                      </span>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        categoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {categoryOpen && (
                    <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {categories.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No categories available.
                        </div>
                      ) : (
                        categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 ${
                              formData.categoryId === category.id
                                ? "bg-gray-50"
                                : ""
                            }`}
                          >
                            <Tag size={16} className="text-gray-500" />

                            <span>{category.name}</span>

                            {formData.categoryId === category.id && (
                              <Check size={16} className="ml-auto" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                {/* Color */}

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color <span className="text-red-500">*</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setColorOpen((prev) => !prev);
                      setCategoryOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.colorId ? "border-red-500" : "border-gray-300"
                    } flex items-center justify-between text-left bg-white`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedColor ? (
                        <span
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{
                            background:
                              selectedColor.name.toLowerCase() === "other"
                                ? "conic-gradient(from 180deg, #ef4444, #f97316, #eab308, #10b981, #3b82f6, #8b5cf6, #ef4444)"
                                : selectedColor.hexCode,
                          }}
                        />
                      ) : (
                        <Palette size={18} className="text-gray-500" />
                      )}

                      <span
                        className={
                          selectedColor ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {selectedColor?.name || "Choose a color"}
                      </span>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        colorOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {colorOpen && (
                    <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {colors.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No colors available.
                        </div>
                      ) : (
                        colors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 ${
                              formData.colorId === color.id ? "bg-gray-50" : ""
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-gray-300"
                              style={{
                                background:
                                  color.name.toLowerCase() === "other"
                                    ? "conic-gradient(from 180deg, #ef4444, #f97316, #eab308, #10b981, #3b82f6, #8b5cf6, #ef4444)"
                                    : color.hexCode,
                              }}
                            />

                            <span>{color.name}</span>

                            {formData.colorId === color.id && (
                              <Check size={16} className="ml-auto" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {errors.colorId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.colorId}
                    </p>
                  )}
                </div>
              </div>

              {/* Location + Date */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Library, Building A"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                        errors.location ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-black/10`}
                    />
                  </div>

                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Date */}

                <div>
                  <label
                    htmlFor="dateLostOrFound"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date {formData.type === "LOST" ? "Lost" : "Found"}{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="dateLostOrFound"
                      name="dateLostOrFound"
                      type="date"
                      value={formData.dateLostOrFound}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                        errors.dateLostOrFound
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-black/10`}
                    />
                  </div>

                  {errors.dateLostOrFound && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dateLostOrFound}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the item, where it was lost/found, identifying marks, etc."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } resize-none focus:outline-none focus:ring-2 focus:ring-black/10`}
                />

                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* --------------------------------------- */}
              {/* Images                                   */}
              {/* --------------------------------------- */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>

                <p className="text-sm text-gray-500 mb-3">
                  Add up to 5 images of the item.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                    >
                      <img
                        src={image.url}
                        alt="Item preview"
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
                        aria-label="Remove image"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-500 transition"
                    >
                      <ImagePlus size={24} />

                      <span className="text-sm">Add image</span>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* --------------------------------------- */}
              {/* Contact information                      */}
              {/* --------------------------------------- */}

              <div className="pt-2 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={formData.contactName}
                        readOnly
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Email */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      value={formData.contactEmail}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------------------------------- */}
            {/* Footer / Submit                            */}
            {/* ----------------------------------------- */}

            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createItemMutation.isPending}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Upload size={18} />

                {createItemMutation.isPending ? "Posting..." : "Create Post"}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* --------------------------------------------- */}
      {/* Confirmation Modal                             */}
      {/* --------------------------------------------- */}

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center pt-30 px-5 py-6 overflow-y-auto"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirmModal(false);
            }
          }}
        >
          <div className="w-full max-w-xl max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Modal header */}

            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Confirm Your Post
              </h2>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={createItemMutation.isPending}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}

            <div className="p-6 space-y-5">
              {/* Post type + Item */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Post type</p>

                  <p className="font-medium text-gray-900 mt-1">
                    {formData.type === "LOST" ? "Lost" : "Found"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Item</p>

                  <p className="font-medium text-gray-900 mt-1">
                    {formData.title}
                  </p>
                </div>
              </div>

              {/* Category + Color */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Category</p>

                  <p className="font-medium text-gray-900 mt-1">
                    {selectedCategory?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Color</p>

                  <div className="flex items-center gap-2 mt-1">
                    {selectedColor && (
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{
                          background:
                            selectedColor.name.toLowerCase() === "other"
                              ? "conic-gradient(from 180deg, #ef4444, #f97316, #eab308, #10b981, #3b82f6, #8b5cf6, #ef4444)"
                              : selectedColor.hexCode,
                        }}
                      />
                    )}

                    <p className="font-medium text-gray-900">
                      {selectedColor?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location + Date */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Location</p>

                  <p className="font-medium text-gray-900 mt-1">
                    {formData.location}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>

                  <p className="font-medium text-gray-900 mt-1">
                    {formData.dateLostOrFound}
                  </p>
                </div>
              </div>

              {/* Images */}
              {images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Images</p>

                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt="Item preview"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation message */}
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-600">
                  Once you confirm, your post will be submitted and linked to
                  your account.
                </p>
              </div>
            </div>

            {/* Modal footer */}

            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={createItemMutation.isPending}
                className="px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={createItemMutation.isPending}
                className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {createItemMutation.isPending
                  ? "Submitting..."
                  : "Confirm & Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
