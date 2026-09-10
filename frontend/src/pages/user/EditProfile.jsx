import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getCurrentUser, updateUser } from "../../services/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    about: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ================= LOAD CURRENT USER =================
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await getCurrentUser();

        setUserId(user.id);

        setFormData({
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "",
          phone: user.phone || "",
          about: user.aboutMe || "",
        });
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts correcting
    if (error) {
      setError("");
    }
  };

  // ================= PHOTO CHANGE =================
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  // ================= SAVE PROFILE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User information could not be found.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Split Full Name into first and last name
      const nameParts = formData.fullName.trim().split(/\s+/);

      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updatedUser = {
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        aboutMe: formData.about.trim(),
      };

      await updateUser(userId, updatedUser);

      console.log("Profile updated:", updatedUser);

      // Return to account/profile page
      navigate("/account");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
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

  return (
    <div className="flex justify-center">
      <div className="box-border flex flex-col justify-center items-center w-full border border-border rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full max-w-[679px] gap-8 px-4 sm:px-6 lg:px-8 py-8"
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
          <div className="flex flex-row items-center gap-3 w-full h-[184px]">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-[182px] h-[184px] rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-[182px] h-[184px] bg-neutral-300 rounded-full flex-shrink-0" />
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
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* ================= FORM FIELDS ================= */}
          <div className="flex flex-col justify-center items-start gap-5 w-full">
            {/* Full Name */}
            <div className="flex flex-col items-start gap-[10px] w-full">
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
            <div className="flex flex-col items-start gap-[10px] w-full">
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
                onChange={handleChange}
                required
                maxLength={254}
                className="box-border w-full h-10 px-4 bg-background border border-border rounded-lg outline-none text-center text-body-sm font-medium text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col items-start gap-[10px] w-full">
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
                  className="box-border w-full h-[84px] px-[10px] py-[10px] resize-none border border-border rounded-lg outline-none text-center text-body-md text-text-secondary focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
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
          <div className="flex flex-row justify-center items-center gap-[34px] w-full h-[46px]">
            <Link
              to="/account"
              className="box-border flex justify-center items-center w-[116px] h-[46px] px-[10px] border border-border rounded-lg text-body-md text-text-primary hover:bg-background-subtle transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex justify-center items-center w-[150px] h-[44px] px-[10px] bg-primary rounded-lg text-body-md text-text-inverse hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
