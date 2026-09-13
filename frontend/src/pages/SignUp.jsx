import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Search,
  Users,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import Button from "../components/Button";
import { useSignup } from "../hooks/useAuth";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const signupMutation = useSignup();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, agreeTerms: e.target.checked }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms =
        "You must agree to the Terms of Use and Privacy Policy.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const signupData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    try {
      await signupMutation.mutateAsync(signupData);

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-12">
      <div className="grid grid-cols-2 gap-10 items-stretch">
        {/* LEFT: decorative info panel */}
        <div className="rounded-2xl text-white p-10 flex flex-col bg-[linear-gradient(180deg,rgba(95,63,210,0.396)_0%,rgba(61,45,125,0.8217)_39.9%,rgba(26,12,42,0.99)_100%)]">
          <div className="w-full h-55 rounded-xl bg-white/10 mt-8 flex items-center justify-center text-white/50 text-body-sm">
            {/* Logo placeholder — bigger to match the wireframe scale. Swap for real logo image later. */}
            <div className="w-72 h-20 rounded-lg bg-white/20" />
          </div>

          <h2 className="text-heading-1 font-bold mt-8">Create account.</h2>
          <h2 className="text-heading-1 font-bold">
            <span className="text-white">Make a </span>
            <span className="text-[#C4B5FD]">difference.</span>
          </h2>

          <p className="text-body-md mt-4 text-white/80 max-w-sm">
            Join LostFound to report lost or found items, make claims, and help
            our community reunite what matters.
          </p>

          {/* Illustration placeholder — swap for the real box/backpack image later */}
          <div className="w-full h-64 rounded-xl bg-white/10 mt-8 flex items-center justify-center text-white/50 text-body-sm">
            Image Placeholder
          </div>

          {/* Feature list — icon left, heading + description right, per the wireframe */}
          <div className="mt-8 space-y-8">
            <div className="flex items-start gap-4">
              <Lock size={40} strokeWidth={1.5} className="shrink-0" />
              <div>
                <h4 className="text-heading-3 font-bold">
                  Secure &amp; Private
                </h4>
                <p className="text-body-sm text-white/70 mt-1">
                  Your data is encrypted and never shared.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Search size={40} strokeWidth={1.5} className="shrink-0" />
              <div>
                <h4 className="text-heading-3 font-bold">
                  Find or Report Easily
                </h4>
                <p className="text-body-sm text-white/70 mt-1">
                  Search, report, and claim items in just a few steps.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users size={40} strokeWidth={1.5} className="shrink-0" />
              <div>
                <h4 className="text-heading-3 font-bold">
                  Help Your Community
                </h4>
                <p className="text-body-sm text-white/70 mt-1">
                  Small actions can help someone get their valuable items back.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: sign-up form card */}
        <div className="border border-border rounded-2xl p-10">
          <div className="flex justify-end text-body-sm text-text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium ml-1">
              Log In
            </Link>
          </div>

          <h1 className="text-heading-1 font-bold text-center mt-4">Sign Up</h1>
          <p className="text-body-md text-text-secondary text-center mt-2">
            Fill in your details to create your LostFound account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            {/* First Name */}
            <div>
              <label className="text-label-md font-medium text-text-primary">
                First Name <span className="text-error">*</span>
              </label>
              <div className="relative mt-1">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter Your First Name"
                  className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.firstName && (
                <p className="text-error text-label-sm mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-label-md font-medium text-text-primary">
                Last Name <span className="text-error">*</span>
              </label>
              <div className="relative mt-1">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Your Last Name"
                  className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.lastName && (
                <p className="text-error text-label-sm mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-label-md font-medium text-text-primary">
                Email Address <span className="text-error">*</span>
              </label>
              <div className="relative mt-1">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email Address"
                  className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.email && (
                <p className="text-error text-label-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-label-md font-medium text-text-primary">
                Password <span className="text-error">*</span>
              </label>
              <div className="relative mt-1">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Your Password"
                  className="w-full border border-border rounded-lg pl-10 pr-10 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-label-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-label-md font-medium text-text-primary">
                Confirm Password <span className="text-error">*</span>
              </label>
              <div className="relative mt-1">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm the Password"
                  className="w-full border border-border rounded-lg pl-10 pr-10 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-label-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-2 text-body-sm text-text-primary">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleCheckboxChange}
                  className="mt-1"
                />
                I agree to the Terms of Use and Privacy Policy.
              </label>
              {errors.agreeTerms && (
                <p className="text-error text-label-sm mt-1">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Submit error (from the API call, not validation) */}
            {signupMutation.isError && (
              <p className="text-error text-body-sm text-center">
                {signupMutation.error?.response?.data?.message ||
                  signupMutation.error?.message ||
                  "Signup failed."}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={signupMutation.isPending}
              className="w-full"
            >
              {signupMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>

            <p className="text-center text-body-sm text-text-secondary">
              or sign up with
            </p>

            {/* OAuth-style buttons — not wired to real auth yet, just UI */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-body-md hover:bg-background-subtle"
            >
              <FcGoogle size={20} />
              Continue with Google.
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-body-md hover:bg-background-subtle"
            >
              <FaApple size={20} />
              Continue withe Apple.
            </button>

            <p className="flex items-center justify-center gap-2 text-label-sm text-text-secondary text-center">
              <Users size={16} />
              We never share your information with anyone.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
