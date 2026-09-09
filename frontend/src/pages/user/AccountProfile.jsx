import {
  Flag,
  Search,
  UserRound,
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Link } from "react-router";

const AccountProfile = () => {
  return (
    <div className="flex justify-center">
      <div className="box-border flex flex-col items-center gap-8 w-full border border-border rounded-lg">
        <div className="flex flex-col items-start gap-[51px] w-full px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="flex flex-row justify-center items-center gap-[19px] w-full xl:w-[395px] h-[184px]">
                {/* Profile Image placeholder — swap for real photo once user data/auth exists */}
                <div className="w-[182px] h-[184px] bg-neutral-300 rounded-full flex-shrink-0" />

                {/* User Details */}
                <div className="flex flex-col justify-center items-center gap-1 w-[194px] h-[184px]">
                  <h2 className="w-full text-heading-1 font-bold text-text-primary">
                    David
                  </h2>
                  <p className="w-full text-body-sm font-medium text-text-primary">
                    myolwin400400@gmail.com
                  </p>
                  <p className="w-full text-body-sm font-medium text-text-primary">
                    Member <span className="text-primary-dark">since 2026</span>
                  </p>
                </div>
              </div>

              {/* Edit + Setting Buttons */}
              <div className="flex flex-row items-start gap-8 w-[264px] h-[46px]">
                <Link
                  to="/account/edit-profile"
                  className="flex justify-center items-center w-[116px] h-[44px] px-[10px] rounded-lg bg-primary text-body-md text-text-inverse hover:bg-primary-dark transition-colors"
                >
                  Edit Profile
                </Link>

                <Link
                  to="/account/settings"
                  className="box-border flex justify-center items-center w-[116px] h-[46px] px-[10px] rounded-lg border border-border-strong bg-transparent text-body-md text-primary-dark hover:bg-background-subtle transition-colors"
                >
                  Setting
                </Link>
              </div>
            </div>

            {/* ================= STATISTICS ================= */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 w-full">
              {/* Item Reports */}
              <div className="box-border flex flex-row justify-center items-center gap-4 w-full h-[62px] border border-border rounded">
                <Flag
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary flex-shrink-0"
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    6
                  </span>
                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Item Reports
                  </span>
                </div>
              </div>

              {/* Items Found */}
              <div className="box-border flex flex-row justify-center items-center gap-6 w-full h-[62px] border border-border rounded">
                <Search
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary flex-shrink-0"
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    8
                  </span>
                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Items Found
                  </span>
                </div>
              </div>

              {/* Claims Submitted */}
              <div className="box-border flex flex-row justify-center items-center gap-4 w-full h-[62px] border border-border rounded">
                <Search
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary flex-shrink-0"
                />
                <div className="flex flex-col justify-center items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    7
                  </span>
                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Claims Submitted
                  </span>
                </div>
              </div>

              {/* Items Returned */}
              <div className="box-border flex flex-row justify-center items-center gap-4 w-full h-[62px] border border-border rounded">
                <Flag
                  size={24}
                  strokeWidth={2}
                  className="text-text-primary rotate-180 flex-shrink-0"
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-3 font-semibold text-text-primary">
                    6
                  </span>
                  <span className="text-body-sm text-text-primary whitespace-nowrap">
                    Items Returned
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LOWER CONTENT ================= */}
          <div className="flex flex-col justify-center items-center gap-[31px] w-full">
            {/* ================= ABOUT ME ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-3 w-full max-w-[660px] min-h-[119px] px-6 border border-border rounded-lg">
              <h3 className="w-full max-w-[475px] text-heading-3 font-semibold text-text-primary">
                About Me
              </h3>
              <p className="w-full max-w-[475px] text-body-sm text-text-primary">
                Hi! I am David. I am from Myanmar.
              </p>
            </div>

            {/* ================= PERSONAL INFORMATION ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-6 w-full max-w-[660px] min-h-[212px] px-6 border border-border rounded-lg">
              <h3 className="w-full max-w-[459px] text-heading-3 font-semibold text-text-primary">
                Personal Information
              </h3>

              <div className="flex flex-col justify-center items-start gap-6 w-full max-w-[459px]">
                {/* Full Name */}
                <div className="flex flex-row items-center gap-14 w-full">
                  <div className="flex flex-row items-center gap-3 w-[146px] flex-shrink-0">
                    <UserRound
                      size={20}
                      strokeWidth={2}
                      className="text-primary-dark"
                    />
                    <span className="text-body-md font-medium text-text-primary">
                      Full Name
                    </span>
                  </div>
                  <span className="text-body-lg text-text-primary">David</span>
                </div>

                {/* Email */}
                <div className="flex flex-row items-center gap-14 w-full">
                  <div className="flex flex-row items-center gap-3 w-[146px] flex-shrink-0">
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
                    myolwin400400@gmail.com
                  </span>
                </div>

                {/* Phone */}
                <div className="flex flex-row items-center gap-14 w-full">
                  <div className="flex flex-row items-center gap-3 w-[146px] flex-shrink-0">
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
                    0945609416
                  </span>
                </div>
              </div>
            </div>

            {/* ================= SECURITY ================= */}
            <div className="box-border flex flex-col justify-center items-center gap-6 w-full max-w-[660px] min-h-[220px] px-6 border border-border rounded-lg">
              <h3 className="w-full max-w-[461px] text-heading-3 font-semibold text-text-primary">
                Security
              </h3>

              <div className="flex flex-col items-start gap-6 w-full max-w-[500px]">
                {/* Password */}
                <div className="flex flex-row items-start gap-14 w-full">
                  <div className="flex flex-row items-start gap-3 w-[230px] flex-shrink-0">
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
                        Last Updated Jan 12, 2026
                      </span>
                    </div>
                  </div>
                  <span className="text-body-lg text-text-primary">
                    *******
                  </span>
                  <button
                    type="button"
                    className="text-body-lg text-primary-dark hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Two Factor Authentication */}
                <div className="flex flex-row items-start gap-14 w-full">
                  <div className="flex flex-row items-start gap-3 w-[230px] flex-shrink-0">
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
            <div className="flex flex-row justify-center items-center gap-4 w-full max-w-[680px] min-h-[72px] px-4 bg-info/20 rounded-lg">
              <Info
                size={20}
                strokeWidth={2}
                className="text-text-primary flex-shrink-0"
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
