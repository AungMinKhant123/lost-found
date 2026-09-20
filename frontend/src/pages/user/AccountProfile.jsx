import {
  Flag,
  UserRound,
  SearchAlert,
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
  Info,
  SearchCheck,
  CornerDownLeft,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { useProfile } from "../../hooks/useProfile";

const AccountProfile = () => {
  const { data: user, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-100 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-100 w-full items-center justify-center">
        <p className="text-body-md text-red-500">Failed to load profile.</p>
      </div>
    );
  }

  // Statistics come from the backend.
  const itemReportsCount = user.stats?.itemReports ?? 0;
  const itemsFoundCount = user.stats?.itemsFound ?? 0;
  const claimsSubmittedCount = user.stats?.claimsSubmitted ?? 0;
  const itemsReturnedCount = user.stats?.itemsReturned ?? 0;

  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : "User";

  const passwordUpdatedDate = user.passwordUpdatedAt
    ? new Date(user.passwordUpdatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not available";

  return (
    <div className="flex justify-center">
      <div className="box-border flex flex-col items-center gap-8 w-full border border-border rounded-lg">
        <div className="flex flex-col items-start gap-12.75 w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* ================= HEADER + PROFILE + STATS ================= */}
          <div className="flex flex-col items-start gap-10 w-full">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-4 w-full">
              <h1 className="w-full text-heading-1 font-bold text-text-primary">
                My Profile
              </h1>

              <p className="w-full text-body-sm text-text-primary">
                Manage your personal information and account.
              </p>
            </div>

            {/* Profile Information + Buttons */}
            <div className="flex flex-col xl:flex-row justify-center items-center gap-6 w-full">
              {/* Profile Image + User Information */}
              <div className="flex flex-row justify-center items-center gap-4.75 w-full xl:w-98.75 h-46">
                {/* Profile Avatar */}
                <div className="w-45.5 h-46 bg-neutral-300 rounded-full shrink-0 flex items-center justify-center text-4xl font-bold text-white uppercase">
                  {fullName.charAt(0)}
                </div>

                {/* User Details */}
                <div className="flex flex-col justify-center items-center gap-1 w-48.5 h-46">
                  <h2 className="w-full text-heading-1 font-bold text-text-primary truncate">
                    {fullName}
                  </h2>

                  <p className="w-full text-body-sm font-medium text-text-primary truncate">
                    {user.email}
                  </p>

                  <p className="w-full text-body-sm font-medium text-text-primary">
                    Member
                  </p>
                </div>
              </div>

              {/* Edit + Setting Buttons */}
              <div className="flex flex-row items-start gap-8 w-66 h-11.5">
                <Link
                  to="/account/edit-profile"
                  className="flex justify-center items-center w-29 h-11 px-2.5 rounded-lg bg-primary text-body-md text-text-inverse hover:bg-primary-dark transition-colors"
                >
                  Edit Profile
                </Link>

                <Link
                  to="/account/settings"
                  className="box-border flex justify-center items-center w-29 h-11 px-2.5 rounded-lg border border-border-strong bg-transparent text-body-md text-primary-dark hover:bg-background-subtle transition-colors"
                >
                  Setting
                </Link>
              </div>
            </div>

            {/* ================= STATISTICS ================= */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 w-full">
              {/* Item Reports */}
              <div className="box-border flex flex-row justify-center items-center gap-6 w-full h-15.5 border border-border rounded">
                <Flag
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary shrink-0"
                />

                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    {itemReportsCount}
                  </span>

                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Item Reports
                  </span>
                </div>
              </div>

              {/* Items Found */}
              <div className="box-border flex flex-row justify-center items-center gap-6 w-full h-15.5 border border-border rounded">
                <SearchAlert
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary shrink-0"
                />

                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    {itemsFoundCount}
                  </span>

                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Items Found
                  </span>
                </div>
              </div>

              {/* Claims Submitted */}
              <div className="box-border flex flex-row justify-center items-center gap-4 w-full h-15.5 border border-border rounded">
                <SearchCheck
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary shrink-0"
                />

                <div className="flex flex-col justify-center items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    {claimsSubmittedCount}
                  </span>

                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Claims Submitted
                  </span>
                </div>
              </div>

              {/* Items Returned */}
              <div className="box-border flex flex-row justify-center items-center gap-4 w-full h-15.5 border border-border rounded">
                <CornerDownLeft
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary rotate-180 shrink-0"
                />

                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    {itemsReturnedCount}
                  </span>

                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Items Returned
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LOWER CONTENT ================= */}
          <div className="flex flex-col justify-center items-center gap-7.75 w-full">
            {/* ================= ABOUT ME ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-3 w-full max-w-165 min-h-29.75 px-6 border border-border rounded-lg">
              <h3 className="w-full max-w-118.75 text-heading-3 font-semibold text-text-primary">
                About Me
              </h3>

              <p className="w-full max-w-118.75 text-body-sm text-text-primary">
                {user.aboutMe || `Hi! I am ${fullName}.`}
              </p>
            </div>

            {/* ================= PERSONAL INFORMATION ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-6 w-full max-w-165 min-h-53 px-6 border border-border rounded-lg py-4">
              <h3 className="w-full max-w-114.75 text-heading-3 font-semibold text-text-primary">
                Personal Information
              </h3>

              <div className="flex flex-col justify-center items-start gap-6 w-full max-w-114.75">
                {/* Full Name */}
                <div className="flex flex-row items-center gap-14 w-full">
                  <div className="flex flex-row items-center gap-3 w-36.5 shrink-0">
                    <UserRound
                      size={20}
                      strokeWidth={2}
                      className="text-primary-dark"
                    />

                    <span className="text-body-md font-medium text-text-primary">
                      Full Name
                    </span>
                  </div>

                  <span className="text-body-lg text-text-primary">
                    {fullName}
                  </span>
                </div>

                {/* Email */}
                <div className="flex flex-row items-center gap-14 w-full">
                  <div className="flex flex-row items-center gap-3 w-36.5 shrink-0">
                    <Mail
                      size={20}
                      strokeWidth={2}
                      className="text-primary-dark"
                    />

                    <span className="text-body-md font-medium text-text-primary whitespace-nowrap">
                      Email Address
                    </span>
                  </div>

                  <span className="text-body-lg text-text-primary break-all">
                    {user.email}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex flex-row items-center gap-14 w-full">
                  <div className="flex flex-row items-center gap-3 w-36.5 shrink-0">
                    <Phone
                      size={20}
                      strokeWidth={2}
                      className="text-primary-dark"
                    />

                    <span className="text-body-md font-medium text-text-primary whitespace-nowrap">
                      Phone Number
                    </span>
                  </div>

                  <span className="text-body-lg text-text-primary">
                    {user.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= SECURITY ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-6 w-full max-w-165 min-h-55 px-6 border border-border rounded-lg py-4">
              <h3 className="w-full max-w-115.25 text-heading-3 font-semibold text-text-primary">
                Security
              </h3>

              <div className="flex flex-col items-start gap-6 w-full max-w-125">
                {/* Password */}
                <div className="flex flex-row items-start gap-14 w-full">
                  <div className="flex flex-row items-start gap-3 w-57.5 shrink-0">
                    <KeyRound
                      size={22}
                      strokeWidth={2}
                      className="text-primary-dark mt-0.5"
                    />

                    <div className="flex flex-col items-start gap-1">
                      <span className="text-body-md font-medium text-text-primary">
                        Password
                      </span>

                      <span className="text-body-sm font-medium text-text-primary whitespace-nowrap">
                        Last Updated {passwordUpdatedDate}
                      </span>
                    </div>
                  </div>

                  <span className="text-body-lg text-text-primary">
                    *******
                  </span>

                  <Link
                    to="/account/change-password"
                    className="text-body-lg text-primary-dark hover:underline"
                  >
                    Change
                  </Link>
                </div>

                {/* Two Factor Authentication */}
                <div className="flex flex-row items-start gap-14 w-full">
                  <div className="flex flex-row items-start gap-3 w-57.5 shrink-0">
                    <ShieldCheck
                      size={20}
                      strokeWidth={2}
                      className="text-primary-dark mt-0.5"
                    />

                    <span className="text-body-md font-medium text-text-primary whitespace-nowrap">
                      Two Factor Authentication
                    </span>
                  </div>

                  <span className="text-body-lg text-text-primary">
                    Disabled
                  </span>

                  <button
                    type="button"
                    className="text-body-lg text-primary-dark hover:underline"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>

            {/* ================= PRIVACY NOTICE ================= */}
            <div className="flex flex-row justify-center items-center gap-4 w-full max-w-170 min-h-18 px-4 bg-info/20 rounded-lg">
              <Info
                size={20}
                strokeWidth={2}
                className="text-text-primary shrink-0"
              />

              <p className="text-body-sm font-medium text-text-primary">
                Your contact information is private and is only shared with
                another when a claim is accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
