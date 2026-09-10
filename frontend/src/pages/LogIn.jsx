import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  LockKeyhole,
  Search,
  Users,
  Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";

import Button from "../components/Button";
import UserHeader from "../components/user/UserHeader";
import UserFooter from "../components/user/UserFooter";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  // ================= FORM STATE =================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= ERROR & LOADING STATE =================

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ================= PASSWORD VISIBILITY =================

  const [showPassword, setShowPassword] = useState(false);

  // ================= EMAIL VALIDATION =================

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    if (!emailPattern.test(value.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    setEmailError("");
    return true;
  };

  // ================= PASSWORD VALIDATION =================

  const validatePassword = (value) => {
    if (!value.trim()) {
      setPasswordError("Please enter your password");
      return false;
    }

    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // ================= FORM SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const user = await loginUser(email, password);

      // Store authenticated user details in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect user upon successful login
      navigate("/");
    } catch (err) {
      setAuthError(err.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-[#F8FAFC] mx-auto px-10 py-12">
        {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

        <div
          className="
          mx-auto
          flex
          w-full
          max-w-[1168px]
          flex-col
          items-start
          gap-10
          lg:flex-row
        "
        >
          {/* =====================================================
            LEFT SIDE CONTENT
        ===================================================== */}

          <section
            className="
            flex
            w-full
            min-h-[900px]
            flex-shrink-0
            flex-col
            items-center
            justify-center
            gap-14
            overflow-hidden
            bg-gradient-to-b
            from-[rgba(142,120,218,0.396)]
            via-[rgba(72,53,150,0.6336)]
            to-[rgba(214,183,248,0.99)]
            lg:h-[1129px]
            lg:w-[571px]
          "
          >
            {/* ================= WELCOME CONTENT ================= */}

            <div className="flex w-[447px] max-w-[85%] flex-col items-start gap-4">
              <div
                className="
                flex
                w-full
                flex-col
                items-end
                gap-3
              "
              >
                <div
                  className="
                  flex
                  w-full
                  flex-col
                  items-start
                  gap-[14px]
                "
                >
                  {/* WELCOME BACK */}

                  <p
                    className="
                    w-full
                    font-['Inter']
                    text-[16px]
                    font-medium
                    leading-6
                    text-[#4B32A8]
                  "
                  >
                    WELCOME BACK
                  </p>

                  {/* HEADING */}

                  <h1
                    className="
                    w-[408px]
                    max-w-full
                    font-['Inter']
                    text-[32px]
                    font-bold
                    leading-10
                    text-black
                  "
                  >
                    Find what matters.
                    <br />
                    Together.
                  </h1>

                  {/* DESCRIPTION */}

                  <p
                    className="
                    w-[290.95px]
                    max-w-full
                    font-['Inter']
                    text-[14px]
                    font-medium
                    leading-5
                    text-black
                  "
                  >
                    Log in to your LostFound account to report lost items, make
                    claims, and help our community reunite what matters.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= FEATURES ================= */}

            <div
              className="
              flex
              w-[351px]
              max-w-[85%]
              flex-col
              gap-9
            "
            >
              {/* ================= SECURE & PRIVATE ================= */}

              <div className="flex w-[314px] items-center gap-[17px]">
                {/* ICON */}

                <div
                  className="
                  flex
                  h-20
                  w-20
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-lg
                "
                >
                  <LockKeyhole
                    size={60}
                    strokeWidth={1.5}
                    className="text-[#6D4AFF]"
                  />
                </div>

                {/* TEXT */}

                <div
                  className="
                  flex
                  h-20
                  w-[217px]
                  flex-col
                  justify-center
                  gap-5
                "
                >
                  <h2
                    className="
                    font-['Inter']
                    text-[24px]
                    font-semibold
                    leading-8
                    text-white
                  "
                  >
                    Secure & Private
                  </h2>

                  <p
                    className="
                    w-[190px]
                    font-['Inter']
                    text-[14px]
                    font-medium
                    leading-5
                    text-black
                  "
                  >
                    Your data is encrypted and never shared.
                  </p>
                </div>
              </div>

              {/* ================= FIND OR REPORT ================= */}

              <div className="flex w-[336px] items-start gap-[17px]">
                {/* ICON */}

                <div
                  className="
                  flex
                  h-20
                  w-20
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-xl
                "
                >
                  <Search
                    size={60}
                    strokeWidth={1.5}
                    className="text-[#4B32A8]"
                  />
                </div>

                {/* TEXT */}

                <div
                  className="
                  flex
                  h-[85px]
                  w-[239px]
                  flex-col
                  items-start
                  gap-[13px]
                "
                >
                  <h2
                    className="
                    w-full
                    font-['Inter']
                    text-[24px]
                    font-semibold
                    leading-8
                    text-white
                  "
                  >
                    Find or Report Easily
                  </h2>

                  <p
                    className="
                    w-[230px]
                    font-['Inter']
                    text-[14px]
                    font-medium
                    leading-5
                    text-black
                  "
                  >
                    Search, report, and claim items in just a few steps.
                  </p>
                </div>
              </div>

              {/* ================= HELP YOUR COMMUNITY ================= */}

              <div className="flex w-[351px] items-start gap-[17px]">
                {/* ICON */}

                <div
                  className="
                  flex
                  h-20
                  w-20
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-xl
                "
                >
                  <Users
                    size={60}
                    strokeWidth={1.5}
                    className="text-[#4B32A8]"
                  />
                </div>

                {/* TEXT */}

                <div
                  className="
                  flex
                  h-[89px]
                  w-[254px]
                  flex-col
                  items-end
                  gap-[17px]
                "
                >
                  <h2
                    className="
                    w-full
                    text-center
                    font-['Inter']
                    text-[24px]
                    font-semibold
                    leading-8
                    text-white
                  "
                  >
                    Help Your Community
                  </h2>

                  <p
                    className="
                    w-[254px]
                    font-['Inter']
                    text-[14px]
                    font-medium
                    leading-5
                    text-black
                  "
                  >
                    Small actions can help someone get their valuable items
                    back.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= LOSTFOUND IMAGE ================= */}

            <div
              className="
              flex
              w-full
              items-end
              justify-center
              overflow-hidden
            "
            >
              <img
                src="/assets/lostfound-box.png"
                alt="LostFound items"
                className="
                h-[320px]
                w-[90%]
                max-w-full 
                rounded-lg bg-neutral-300
              "
              />
            </div>
          </section>

          {/* =====================================================
            RIGHT LOGIN AREA
        ===================================================== */}

          <section
            className="
            flex
            w-full
            flex-shrink-0
            justify-center
            lg:w-[541px]
          "
          >
            {/* ================= LOGIN FORM CONTAINER ================= */}

            <div
              className="
              flex
              w-full
              flex-col
              items-center
              justify-center
              gap-2
              bg-white
              lg:h-[905px]
            "
            >
              {/* ================= LOGIN CARD ================= */}

              <div
                className="
                box-border
                flex
                w-full
                flex-col
                items-center
                justify-center
                gap-8
                rounded-xl
                border
                border-[#A9B3BD]
                bg-white
                px-5
                py-8
                lg:min-h-[833px]
                lg:w-[541px]
              "
              >
                {/* ================= LOGIN HEADER ================= */}

                <div
                  className="
                  flex
                  w-full
                  flex-col
                  items-center
                  justify-center
                "
                >
                  <div
                    className="
                    flex
                    w-full
                    flex-col
                    items-center
                    justify-center
                    gap-[22px]
                  "
                  >
                    <h2
                      className="
                      w-full
                      text-center
                      font-['Inter']
                      text-[32px]
                      font-bold
                      leading-10
                      text-black
                    "
                    >
                      Log In
                    </h2>

                    <p
                      className="
                      w-[241px]
                      text-center
                      font-['Inter']
                      text-[16px]
                      font-normal
                      leading-6
                      text-black
                    "
                    >
                      Welcome back! Please enter your details to continue.
                    </p>
                  </div>
                </div>

                {/* ================= FORM CONTENT ================= */}

                <form
                  className="
                  flex
                  w-full
                  flex-col
                  items-center
                  lg:w-[349px]
                "
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* API ERROR MESSAGE BANNER */}
                  {authError && (
                    <div className="mb-4 w-full rounded-lg bg-red-50 p-3 text-center text-[14px] font-medium text-[#DC2626] border border-red-200">
                      {authError}
                    </div>
                  )}

                  {/* =================================================
                    EMAIL
                ================================================= */}

                  <div className="w-full">
                    <div className="flex w-full flex-col gap-2.5">
                      <label
                        htmlFor="email"
                        className="
                        font-['Inter']
                        text-[16px]
                        font-medium
                        leading-6
                        text-black
                      "
                      >
                        Email Address <span className="text-[#DC2626]">*</span>
                      </label>

                      <div className="relative w-full">
                        <Mail
                          size={18}
                          strokeWidth={1.8}
                          className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#4B32A8]
                        "
                        />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          maxLength={254}
                          autoComplete="email"
                          onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);

                            if (emailError) {
                              setEmailError("");
                            }
                            if (authError) {
                              setAuthError("");
                            }
                          }}
                          onBlur={() => validateEmail(email)}
                          placeholder="Enter Your Email Address"
                          aria-invalid={!!emailError}
                          aria-describedby={
                            emailError ? "email-error" : undefined
                          }
                          className={`
                          box-border
                          h-10
                          w-full
                          rounded-lg
                          border
                          bg-white
                          pl-12
                          pr-4
                          font-['Inter']
                          text-[14px]
                          font-medium
                          text-black
                          outline-none
                          placeholder:text-[#708090]
                          focus:ring-1
                          focus:ring-[#4B32A8]/20
                          ${
                            emailError
                              ? "border-[#DC2626] focus:border-[#DC2626]"
                              : "border-[#A9B3BD] focus:border-[#4B32A8]"
                          }
                        `}
                        />
                      </div>

                      {/* EMAIL ERROR */}

                      {emailError && (
                        <p
                          id="email-error"
                          className="
                          font-['Inter']
                          text-[12px]
                          font-medium
                          leading-4
                          text-[#DC2626]
                        "
                        >
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                    PASSWORD
                ================================================= */}

                  <div className="mt-6 w-full">
                    <div className="flex w-full flex-col gap-2.5">
                      <label
                        htmlFor="password"
                        className="
                        font-['Inter']
                        text-[16px]
                        font-medium
                        leading-6
                        text-black
                      "
                      >
                        Password <span className="text-[#DC2626]">*</span>
                      </label>

                      <div className="relative w-full">
                        <KeyRound
                          size={18}
                          strokeWidth={1.8}
                          className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#4B32A8]
                        "
                        />

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          maxLength={128}
                          autoComplete="current-password"
                          onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);

                            if (passwordError) {
                              setPasswordError("");
                            }
                            if (authError) {
                              setAuthError("");
                            }
                          }}
                          onBlur={() => validatePassword(password)}
                          placeholder="Enter Your Password"
                          aria-invalid={!!passwordError}
                          aria-describedby={
                            passwordError ? "password-error" : undefined
                          }
                          className={`
                          box-border
                          h-10
                          w-full
                          rounded-lg
                          border
                          bg-white
                          pl-12
                          pr-12
                          font-['Inter']
                          text-[14px]
                          font-medium
                          text-black
                          outline-none
                          placeholder:text-[#708090]
                          focus:ring-1
                          focus:ring-[#4B32A8]/20
                          ${
                            passwordError
                              ? "border-[#DC2626] focus:border-[#DC2626]"
                              : "border-[#A9B3BD] focus:border-[#4B32A8]"
                          }
                        `}
                        />

                        {/* SHOW / HIDE PASSWORD */}

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#4B32A8]
                          transition
                          hover:text-[#6D4AFF]
                        "
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} strokeWidth={1.7} />
                          ) : (
                            <Eye size={18} strokeWidth={1.7} />
                          )}
                        </button>
                      </div>

                      {/* PASSWORD ERROR */}

                      {passwordError && (
                        <p
                          id="password-error"
                          className="
                          font-['Inter']
                          text-[12px]
                          font-medium
                          leading-4
                          text-[#DC2626]
                        "
                        >
                          {passwordError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                    REMEMBER ME / FORGOT PASSWORD
                ================================================= */}

                  <div
                    className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-between
                  "
                  >
                    <label
                      htmlFor="remember"
                      className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                    "
                    >
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="
                        h-[15px]
                        w-[15px]
                        accent-[#6D4AFF]
                      "
                      />

                      <span
                        className="
                        font-['Inter']
                        text-[12px]
                        font-medium
                        leading-4
                        text-black
                      "
                      >
                        Remember Me
                      </span>
                    </label>

                    <button
                      type="button"
                      className="
                      font-['Inter']
                      text-[12px]
                      font-medium
                      leading-4
                      text-black
                      transition
                      hover:text-[#4B32A8]
                    "
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="
                    mt-6
                    flex
                    items-center
                    justify-center
                    gap-2
                    h-[50px]
                    w-full
                    rounded-xl
                    px-0
                    py-0
                    font-['Inter']
                    text-[16px]
                    font-medium
                    leading-6
                    disabled:opacity-70
                  "
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>

                  {/* =================================================
                    OR LOGIN WITH
                ================================================= */}

                  <div
                    className="
                    flex
                    h-9
                    w-full
                    items-center
                    justify-center
                    py-2.5
                  "
                  >
                    <span
                      className="
                      font-['Inter']
                      text-[12px]
                      font-medium
                      leading-4
                      text-black
                    "
                    >
                      or log in with
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 mb-3 text-body-md hover:bg-background-subtle"
                  >
                    <FcGoogle size={20} />
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-body-md hover:bg-background-subtle"
                  >
                    <FaApple size={20} />
                    Continue with Apple
                  </button>

                  {/* =================================================
                    SIGN UP
                ================================================= */}

                  <div
                    className="
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-center
                    gap-1
                  "
                  >
                    <span
                      className="
                      font-['Inter']
                      text-[12px]
                      font-medium
                      leading-4
                      text-black
                    "
                    >
                      Don&apos;t have an account?
                    </span>

                    <Link
                      to="/signup"
                      className="
                      font-['Inter']
                      text-[12px]
                      font-medium
                      leading-4
                      text-[#4B32A8]
                      hover:underline
                    "
                    >
                      Sign Up
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
      <UserFooter />
    </>
  );
};

export default Login;
