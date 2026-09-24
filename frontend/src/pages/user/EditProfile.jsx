import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useProfile, useUpdateProfile } from "../../hooks/useProfile";

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

  // Preview URL for displaying the selected image
  const [profileImage, setProfileImage] = useState(null);

  // Actual File object that will be sent to the backend
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [error, setError] = useState("");

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
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==================================================
  // PHOTO CHANGE
  // ==================================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Client-side validation
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

    // Store the actual File object
    setProfileImageFile(file);

    // Create preview
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    if (error) {
      setError("");
    }
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

    try {
      setError("");

      // ----------------------------------------------
      // Basic validation
      // ----------------------------------------------

      const fullName = formData.fullName.trim();

      if (!fullName) {
        setError("Full name cannot be empty.");
        return;
      }

      if (!formData.profession) {
        setError("Please select your profession.");
        return;
      }

      // ----------------------------------------------
      // Create multipart FormData
      // ----------------------------------------------

      const data = new FormData();

      data.append("fullName", fullName);
      data.append("phone", formData.phone.trim());
      data.append("socialMedia", formData.socialMedia.trim());
      data.append("profession", formData.profession);
      data.append("aboutMe", formData.about.trim());

      // Only append the image when the user selected
      // a new one.
      if (profileImageFile) {
        data.append("profileImage", profileImageFile);
      }

      // ----------------------------------------------
      // Send to backend
      // ----------------------------------------------

      await updateProfileMutation.mutateAsync(data);

      console.log("Profile updated successfully");

      // ----------------------------------------------
      // Return to account/profile page
      // ----------------------------------------------

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
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-45.5[184px] rounded-full object-cover shrink-0"
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
                required
                maxLength={100}
                className="box-border w-full h-10 px-4 bg-background border border-border rounded-lg outline-none text-center text-body-sm font-medium text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              />
            </div>

            {/* Email */}

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
                className="box-border w-full h-10 px-4 bg-background border border-border rounded-lg outline-none text-center text-body-sm font-medium text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              />
            </div>

            {/* Phone Number */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label
                htmlFor="phone"
                className="text-body-md font-medium text-text-primary"
              >
                Phone Number <span className="text-error">*</span>
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={20}
                className="box-border w-full h-10 px-4 bg-background border border-border rounded-lg outline-none text-center text-body-sm font-medium text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              />
            </div>

            {/* Social Media */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label
                htmlFor="socialMedia"
                className="text-body-md font-medium text-text-primary"
              >
                Social Media <span className="text-error">*</span>
              </label>

              <input
                id="socialMedia"
                name="socialMedia"
                type="text"
                value={formData.socialMedia}
                onChange={handleChange}
                required
                maxLength={254}
                className="box-border w-full h-10 px-4 bg-background border border-border rounded-lg outline-none text-center text-body-sm font-medium text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              />
            </div>

            {/* Profession */}

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label
                htmlFor="profession"
                className="text-body-md font-medium text-text-primary"
              >
                Profession <span className="text-error">*</span>
              </label>

              <select
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="box-border w-full h-10 px-4 bg-background border border-border rounded-lg outline-none text-center text-body-sm font-medium text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              >
                <option value="" disabled>
                  Select profession
                </option>

                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="WORKER">Worker</option>
              </select>
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
