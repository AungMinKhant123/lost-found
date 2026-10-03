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
  Briefcase,
  Link2,
} from "lucide-react";
import { Link } from "react-router";
import { useProfile } from "../../hooks/useProfile";

// "STUDENT" -> "Student"
function formatProfession(value) {
  if (!value) return "";
  const lower = String(value).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// Only treat a value as a clickable link if it's a real http(s) URL.
function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// One row of the Personal Information card.
// Phone-sized (< sm): icon+label on one line, value below it.
// sm+ keeps the original side-by-side layout.
const InfoRow = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col items-start gap-1.5 w-full sm:flex-row sm:items-center sm:gap-14">
    <div className="flex flex-row items-center gap-3 w-full sm:w-36.5 shrink-0">
      <Icon size={20} strokeWidth={2} className="text-primary-dark" />
      <span className="text-body-md font-medium text-text-primary whitespace-nowrap">
        {label}
      </span>
    </div>
    <div className="pl-8 min-w-0 sm:pl-0">{children}</div>
  </div>
);

const AddLink = () => (
  <Link
    to="/account/edit-profile"
    className="text-body-lg text-primary-dark hover:underline"
  >
    + Add
  </Link>
);

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

  // KPI cards arranged in the 2x2 wireframe order
  const statCards = [
    {
      label: "Item Reports",
      value: user.stats?.itemReports ?? 0,
      icon: Flag,
      iconClass: "",
    },
    {
      label: "Items Returned",
      value: user.stats?.itemsReturned ?? 0,
      icon: CornerDownLeft,
      iconClass: "rotate-180",
    },
    {
      label: "Claims Submitted",
      value: user.stats?.claimsSubmitted ?? 0,
      icon: SearchCheck,
      iconClass: "",
    },
    {
      label: "Items Found",
      value: user.stats?.itemsFound ?? 0,
      icon: SearchAlert,
      iconClass: "",
    },
  ];

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
              <div className="flex flex-row justify-center items-center gap-4.75 w-full xl:w-98.75">
                {/* Profile Avatar */}
                {user.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={`${fullName}'s profile`}
                    className="w-24 h-24 sm:w-28 sm:h-28 xl:w-45.5 xl:h-46 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 xl:w-45.5 xl:h-46 bg-neutral-300 rounded-full shrink-0 flex items-center justify-center text-4xl font-bold text-white uppercase">
                    {fullName.charAt(0)}
                  </div>
                )}

                {/* User Details */}
                <div className="flex flex-col justify-center items-start gap-1 min-w-0 flex-1">
                  <h2 className="w-full text-heading-1 font-bold text-text-primary break-words">
                    {fullName}
                  </h2>

                  <p className="w-full text-body-sm font-medium text-text-primary break-all">
                    {user.email}
                  </p>

                  <p className="w-full text-body-sm font-medium text-text-primary">
                    Member
                  </p>
                </div>
              </div>

              {/* Edit + Setting Buttons */}
              <div className="flex flex-row items-start justify-center gap-8 w-full xl:w-66">
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

            {/* ================= STATISTICS (WIREFRAME 2x2 DESIGN) ================= */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-145 mx-auto">
              {statCards.map(({ label, value, icon: Icon, iconClass }) => (
                <div
                  key={label}
                  className="flex flex-col border border-border rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  {/* Card Header Section */}
                  <div className="flex items-center justify-center gap-2.5 bg-neutral-50 border-b border-border py-2.5 px-4">
                    <Icon
                      size={20}
                      strokeWidth={2}
                      className={`text-primary-dark shrink-0 ${iconClass}`}
                    />
                    <span className="text-body-md font-medium text-text-primary whitespace-nowrap">
                      {label}
                    </span>
                  </div>

                  {/* Card Value Section */}
                  <div className="flex items-center justify-center py-5">
                    <span className="text-3xl font-bold text-text-primary">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= LOWER CONTENT ================= */}
          <div className="flex flex-col justify-center items-center gap-7.75 w-full">
            {/* ================= ABOUT ME ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-3 w-full max-w-165 min-h-29.75 px-6 border border-border rounded-lg py-4">
              <h3 className="w-full text-heading-3 font-semibold text-text-primary text-center">
                About Me
              </h3>

              <p className="w-full max-w-118.75 text-body-sm text-text-primary text-center">
                {user.aboutMe || `Hi! I am ${fullName}.`}
              </p>
            </div>

            {/* ================= PERSONAL INFORMATION ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-6 w-full max-w-165 min-h-53 px-6 border border-border rounded-lg py-4">
              <h3 className="w-full text-heading-3 font-semibold text-text-primary text-center">
                Personal Information
              </h3>

              <div className="flex flex-col justify-center items-start gap-6 w-full max-w-114.75">
                <InfoRow icon={UserRound} label="Full Name">
                  <span className="min-w-0 break-words text-body-lg text-text-primary">
                    {fullName}
                  </span>
                </InfoRow>

                <InfoRow icon={Mail} label="Email Address">
                  <span className="min-w-0 break-all text-body-lg text-text-primary">
                    {user.email}
                  </span>
                </InfoRow>

                <InfoRow icon={Phone} label="Phone Number">
                  {user.phone ? (
                    <span className="min-w-0 break-all text-body-lg text-text-primary">
                      {user.phone}
                    </span>
                  ) : (
                    <AddLink />
                  )}
                </InfoRow>

                <InfoRow icon={Briefcase} label="Profession">
                  {user.profession ? (
                    <span className="min-w-0 break-words text-body-lg text-text-primary">
                      {formatProfession(user.profession)}
                    </span>
                  ) : (
                    <AddLink />
                  )}
                </InfoRow>

                <InfoRow icon={Link2} label="Social Media">
                  {user.socialMedia ? (
                    isHttpUrl(user.socialMedia) ? (
                      <a
                        href={user.socialMedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 break-all text-body-lg text-primary-dark hover:underline"
                      >
                        {user.socialMedia}
                      </a>
                    ) : (
                      <span className="min-w-0 break-all text-body-lg text-text-primary">
                        {user.socialMedia}
                      </span>
                    )
                  ) : (
                    <AddLink />
                  )}
                </InfoRow>
              </div>
            </div>

            {/* ================= SECURITY ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-6 w-full max-w-165 min-h-55 px-6 border border-border rounded-lg py-4">
              <h3 className="w-full text-heading-3 font-semibold text-text-primary text-center">
                Security
              </h3>

              <div className="flex flex-col items-start gap-6 w-full max-w-125">
                {/* Password */}
                <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-start sm:gap-14">
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

                  <div className="flex flex-row items-start gap-6">
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
                </div>

                {/* Two Factor Authentication */}
                <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-start sm:gap-14">
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

                  <div className="flex flex-row items-start gap-6">
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
