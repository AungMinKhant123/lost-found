import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser, updateUser } from "../../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // Form state
  // --------------------------------------------------

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --------------------------------------------------
  // Password visibility
  // --------------------------------------------------

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    general: "",
  });

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  // --------------------------------------------------
  // Password requirements
  // --------------------------------------------------

  const requirements = {
    hasNumber: /\d/.test(formData.newPassword),
    minLength: formData.newPassword.length >= 8,
    hasSpecial: /[^A-Za-z0-9]/.test(formData.newPassword),
  };

  // --------------------------------------------------
  // Handle input changes
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts correcting
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  // --------------------------------------------------
  // Toggle password visibility
  // --------------------------------------------------

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // --------------------------------------------------
  // Validate new password
  // --------------------------------------------------

  const validateNewPassword = () => {
    if (!formData.newPassword) {
      return "New password is required.";
    }

    if (!requirements.minLength) {
      return "Password must be at least 8 characters.";
    }

    if (!requirements.hasNumber) {
      return "Password must contain at least one number.";
    }

    if (!requirements.hasSpecial) {
      return "Password must contain at least one special character.";
    }

    return "";
  };

  // --------------------------------------------------
  // Validate confirm password
  // --------------------------------------------------

  const validateConfirmPassword = () => {
    if (!formData.confirmPassword) {
      return "Please confirm your new password.";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
    });

    let hasError = false;

    // -----------------------------------------------
    // Current password
    // -----------------------------------------------

    if (!formData.currentPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required.",
      }));

      hasError = true;
    }

    // -----------------------------------------------
    // New password
    // -----------------------------------------------

    const newPasswordError = validateNewPassword();

    if (newPasswordError) {
      setErrors((prev) => ({
        ...prev,
        newPassword: newPasswordError,
      }));

      hasError = true;
    }

    // -----------------------------------------------
    // Confirm password
    // -----------------------------------------------

    const confirmPasswordError = validateConfirmPassword();

    if (confirmPasswordError) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));

      hasError = true;
    }

    // Stop if validation fails
    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      // -----------------------------------------------
      // Get current user
      // -----------------------------------------------

      const user = await getCurrentUser();

      // -----------------------------------------------
      // Check current password
      // -----------------------------------------------

      if (user.password !== formData.currentPassword) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect.",
        }));

        return;
      }

      // -----------------------------------------------
      // Prevent same password
      // -----------------------------------------------

      if (user.password === formData.newPassword) {
        setErrors((prev) => ({
          ...prev,
          newPassword:
            "New password must be different from your current password.",
        }));

        return;
      }

      // -----------------------------------------------
      // Update password in JSON Server
      // -----------------------------------------------

      await updateUser(user.id, {
        password: formData.newPassword,
        confirmPassword: formData.newPassword,
      });

      navigate("/account/password-updated");
      console.log(
        "Password updated successfully. Navigating to PasswordUpdated page.",
      );
    } catch (error) {
      console.error("Change password error:", error);

      setErrors((prev) => ({
        ...prev,
        general:
          error.message || "Unable to change password. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
    });

    navigate("/account");
  };

  // ==================================================
  // CHANGE PASSWORD UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8">
      <div
        className="
          w-full
          max-w-[600px]
          min-h-[654px]
          border
          border-[#A9B3BD]
          rounded-[8px]
          bg-[#F8FAFC]
          flex
          flex-col
          items-center
          justify-center
          px-5
          sm:px-[34px]
          py-8
        "
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[530px] flex flex-col gap-6"
        >
          {/* Header */}

          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] leading-[40px] font-bold text-black">
              Change Password
            </h1>

            <p className="text-[14px] leading-[20px] font-normal text-black">
              Keep your account secure by using a strong password.
            </p>
          </div>

          {/* General Error */}

          {errors.general && (
            <div
              className="
                w-full
                rounded-[8px]
                border
                border-red-300
                bg-red-50
                px-4
                py-3
                text-[14px]
                text-red-600
              "
            >
              {errors.general}
            </div>
          )}

          {/* Password Fields */}

          <div className="flex flex-col gap-5">
            {/* Current Password */}

            <PasswordField
              label="Current password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              show={showPassword.current}
              onToggle={() => togglePassword("current")}
              error={errors.currentPassword}
            />

            {/* New Password */}

            <PasswordField
              label="New password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              show={showPassword.new}
              onToggle={() => togglePassword("new")}
              error={errors.newPassword}
            />

            {/* Confirm Password */}

            <PasswordField
              label="Confirm new password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              show={showPassword.confirm}
              onToggle={() => togglePassword("confirm")}
              error={errors.confirmPassword}
            />
          </div>

          {/* Password Requirements */}

          <div
            className="
              w-full
              min-h-[115px]
              border
              border-[#6D4AFF]
              rounded-[8px]
              flex
              flex-col
              items-center
              justify-center
              gap-3
              px-4
              py-4
            "
          >
            <p className="text-[14px] leading-[20px] text-[#6D4AFF]">
              Password must include:
            </p>

            <div className="flex flex-col gap-[2px] w-full max-w-[219px]">
              <Requirement valid={requirements.hasNumber}>
                One number
              </Requirement>

              <Requirement valid={requirements.minLength}>
                At least 8 characters
              </Requirement>

              <Requirement valid={requirements.hasSpecial}>
                One special character.
              </Requirement>
            </div>
          </div>

          {/* Buttons */}

          <div className="flex justify-center items-center gap-[34px] pt-2">
            {/* Cancel */}

            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="
                w-[116px]
                h-[46px]
                border
                border-[#A9B3BD]
                rounded-[8px]
                bg-transparent
                text-black
                text-[16px]
                leading-[24px]
                font-normal
                hover:bg-gray-100
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>

            {/* Save Changes */}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-[150px]
                h-[46px]
                rounded-[8px]
                bg-[#6D4AFF]
                text-white
                text-[16px]
                leading-[24px]
                font-normal
                hover:bg-[#5B3BE0]
                active:bg-[#4F32C9]
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// PASSWORD FIELD
// ======================================================

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
  error,
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="
          block
          mb-[10px]
          text-[16px]
          leading-[24px]
          font-medium
          text-black
        "
      >
        {label} <span className="text-red-600">*</span>
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete="off"
          maxLength={128}
          className={`
            box-border
            w-full
            h-[46px]
            rounded-[8px]
            bg-white
            border
            px-4
            pr-12
            text-[16px]
            text-black
            outline-none
            transition
            ${
              error
                ? "border-red-500 focus:ring-1 focus:ring-red-300"
                : "border-[#A9B3BD] focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF]"
            }
          `}
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            flex
            items-center
            justify-center
            w-7
            h-7
            text-[#4B32A8]
            hover:text-[#6D4AFF]
            transition
          "
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-[12px] leading-[18px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// ======================================================
// PASSWORD REQUIREMENT
// ======================================================

function Requirement({ valid, children }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          h-[13px]
          w-[13px]
          rounded-full
          flex-shrink-0
          ${valid ? "bg-[#0EB656]" : "bg-[#D9D9D9]"}
        `}
      />

      <span
        className={`
          text-[14px]
          leading-[20px]
          ${valid ? "text-[#0EB656]" : "text-black"}
        `}
      >
        {children}
      </span>
    </div>
  );
}

// ======================================================
// EYE ICON
// ======================================================

function EyeIcon() {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 8C1 8 4.5 2 11 2C17.5 2 21 8 21 8C21 8 17.5 14 11 14C4.5 14 1 8 1 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// ======================================================
// EYE OFF ICON
// ======================================================

function EyeOffIcon() {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3L19 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M1 9C1 9 4.5 3 11 3C17.5 3 21 9 21 9C21 9 17.5 15 11 15C4.5 15 1 9 1 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="11" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
