import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";

import { useProfile, useUpdateProfile } from "../../hooks/useProfile";

// Digits only, 7-15 long: no letters, spaces, dashes or "+" signs.
const PHONE_PATTERN = /^\d{7,15}$/;

// Social media must be a real web link.
function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const inputBase =
  "box-border w-full h-10 px-4 bg-background border rounded-lg outline-none text-left text-body-sm font-medium text-text-primary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark";

const PROFESSION_OPTIONS = [
  { label: "Student", value: "STUDENT" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Worker", value: "WORKER" },
];

export default function EditProfile() {
  const navigate = useNavigate();

  // ==================================================
  // PROFILE QUERY
  // ==================================================

  const {
    data: user,
    isLoading: profileLoading,
    isError: profileError,
  } = useProfile();

  // ==================================================
  // UPDATE PROFILE MUTATION
  // ==================================================

  const updateProfileMutation = useUpdateProfile();

  // ==================================================
  // FORM STATE
  // ==================================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    socialMedia: "",
    profession: "",
    about: "",
  });

  // Custom Dropdown state & ref
  const [isProfessionOpen, setIsProfessionOpen] = useState(false);
  const professionRef = useRef(null);

  // Preview URL for a newly selected image
  const [profileImage, setProfileImage] = useState(null);

  // Actual File object that will be sent to the backend
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Server/general error banner
  const [error, setError] = useState("");

  // Per-field validation messages, e.g. { phone: "..." }
  const [fieldErrors, setFieldErrors] = useState({});

  // ==================================================
  // LOAD USER INTO FORM
  // ==================================================

  useEffect(() => {
    if (!user) return;

    setFormData({
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email || "",
      phone: user.phone || "",
      socialMedia: user.socialMedia || "",
      profession: user.profession || "",
      about: user.aboutMe || "",
    });
  }, [user]);

  // ==================================================
  // CLICK OUTSIDE HANDLER FOR DROPDOWN
  // ==================================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (professionRef.current && !professionRef.current.contains(e.target)) {
        setIsProfessionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");

    // Clear a field's own message as soon as the user edits it.
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==================================================
  // PHOTO CHANGE
  // ==================================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    // Backend limit is 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5 MB.");
      return;
    }

    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file));

    if (error) setError("");
  };

  // ==================================================
  // VALIDATION
  // ==================================================

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name cannot be empty.";
    }

    const phone = formData.phone.trim();
    if (phone && !PHONE_PATTERN.test(phone)) {
      errors.phone =
        "Phone number can only contain digits (7-15 digits, no letters, spaces or symbols).";
    }

    const socialMedia = formData.socialMedia.trim();
    if (socialMedia && !isValidHttpUrl(socialMedia)) {
      errors.socialMedia =
        "Enter a valid link starting with http:// or https://";
    }

    return errors;
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("User information could not be found.");
      return;
    }

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setError("");

      const data = new FormData();

      data.append("fullName", formData.fullName.trim());
      data.append("phone", formData.phone.trim());
      data.append("socialMedia", formData.socialMedia.trim());
      data.append("aboutMe", formData.about.trim());

      if (formData.profession) {
        data.append("profession", formData.profession);
      }

      if (profileImageFile) {
        data.append("profileImage", profileImageFile);
      }

      await updateProfileMutation.mutateAsync(data);

      navigate("/account");
    } catch (err) {
      console.error("Failed to update profile:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to save your profile. Please try again.";

      setError(message);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (profileLoading) {
    return (
      <div className="flex justify-center">
        <div className="box-border flex flex-col justify-center items-center w-full border border-border rounded-lg">
          <div className="py-10 text-body-md text-text-secondary">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // PROFILE ERROR
  // ==================================================

  if (profileError && !user) {
    return (
      <div className="flex justify-center">
        <div className="box-border flex flex-col justify-center items-center w-full border border-border rounded-lg">
          <div className="py-10 text-body-md text-error">
            Unable to load your profile.
          </div>
        </div>
      </div>
    );
  }

  const photoSrc = profileImage || user?.profileUrl;

  const selectedProfessionLabel = PROFESSION_OPTIONS.find(
    (opt) => opt.value === formData.profession,
  )?.label;

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="flex justify-center">
      <div className="box-border flex flex-col justify-center items-center w-full border border-border rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full max-w-169.75 gap-8 px-4 sm:px-6 lg:px-8 py-8"
        >
          {/* ================= HEADER ================= */}

          <div className="flex flex-col items-start gap-4 w-full">
            <h1 className="w-full text-heading-1 font-bold text-text-primary">
              My Profile
            </h1>

            <p className="w-full text-body-sm text-text-primary">
              Upload your personal information and keep your account secure
            </p>
          </div>

          {/* ================= PROFILE PHOTO ================= */}

          <div className="flex flex-row items-center gap-3 w-full h-46">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt="Profile"
                className="w-45.5 h-46 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-45.5 h-46 bg-neutral-300 rounded-full shrink-0" />
            )}

            <label
              htmlFor="profile-photo"
              className="text-body-md font-medium text-primary-dark cursor-pointer hover:underline"
            >
              Change Photo
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* ================= FORM FIELDS ================= */}

          <div className="flex flex-col justify-center items-start gap-5 w-full">
            {/* Full Name */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label
                htmlFor="fullName"
                className="text-body-md font-medium text-text-primary"
              >
                Full Name <span className="text-error">*</span>
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={100}
                className={`${inputBase} ${
                  fieldErrors.fullName ? "border-error" : "border-border"
                }`}
              />
              {fieldErrors.fullName && (
                <p className="text-error text-label-sm">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Email (read-only) */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label
                htmlFor="email"
                className="text-body-md font-medium text-text-primary"
              >
                Email Address <span className="text-error">*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                readOnly
                maxLength={254}
                className={`${inputBase} border-border`}
              />
            </div>

            {/* Phone Number */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label
                htmlFor="phone"
                className="text-body-md font-medium text-text-primary"
              >
                Phone Number{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                placeholder="e.g. 0812345678"
                className={`${inputBase} ${
                  fieldErrors.phone ? "border-error" : "border-border"
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-error text-label-sm">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Social Media */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label
                htmlFor="socialMedia"
                className="text-body-md font-medium text-text-primary"
              >
                Social Media{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>

              <input
                id="socialMedia"
                name="socialMedia"
                type="text"
                value={formData.socialMedia}
                onChange={handleChange}
                maxLength={254}
                placeholder="https://www.facebook.com/your.name"
                className={`${inputBase} ${
                  fieldErrors.socialMedia ? "border-error" : "border-border"
                }`}
              />
              {fieldErrors.socialMedia && (
                <p className="text-error text-label-sm">
                  {fieldErrors.socialMedia}
                </p>
              )}
            </div>

            {/* Custom Profession Dropdown */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label className="text-body-md font-medium text-text-primary">
                Profession{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>

              <div className="relative w-full" ref={professionRef}>
                <button
                  type="button"
                  onClick={() => setIsProfessionOpen((v) => !v)}
                  className="w-full flex items-center justify-between border border-border rounded-lg px-4 h-10 text-body-sm font-medium text-left focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark bg-background"
                >
                  <span
                    className={
                      formData.profession
                        ? "text-text-primary"
                        : "text-text-secondary"
                    }
                  >
                    {selectedProfessionLabel || "Select profession"}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-text-secondary transition-transform ${
                      isProfessionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfessionOpen && (
                  <ul className="absolute z-10 w-full mt-1 max-h-[308px] overflow-y-auto custom-scrollbar border border-border rounded-lg bg-surface shadow-lg">
                    {PROFESSION_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              profession: opt.value,
                            }));
                            setIsProfessionOpen(false);
                            if (error) setError("");
                          }}
                          className="w-full text-left px-3 py-2.5 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse transition-colors"
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* About Me */}

            <div className="flex flex-col items-end gap-1 w-full">
              <div className="flex flex-col items-start gap-1 w-full">
                <label
                  htmlFor="about"
                  className="w-full text-body-md font-medium text-text-primary"
                >
                  About Me
                </label>

                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  maxLength={100}
                  rows={3}
                  className="box-border w-full h-21 px-2.5 py-2.5 resize-none border border-border rounded-lg outline-none text-center text-body-md text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
                />
              </div>

              <span className="text-body-sm text-text-primary">
                {formData.about.length}/100
              </span>
            </div>
          </div>

          {/* ================= ERROR MESSAGE ================= */}

          {error && (
            <p className="w-full text-center text-body-sm text-error">
              {error}
            </p>
          )}

          {/* ================= BUTTONS ================= */}

          <div className="flex flex-row justify-center items-center gap-8.5 w-full h-11.5">
            <Link
              to="/account"
              className="box-border flex justify-center items-center w-29 h-11 px-2.5 border border-border rounded-lg text-body-md text-text-primary hover:bg-background-subtle transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex justify-center items-center w-37.5 h-11 px-2.5 bg-primary rounded-lg text-body-md text-text-inverse hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
