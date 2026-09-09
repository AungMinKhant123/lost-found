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

const Profile = () => {
  return (
    <>
      <div className="flex gap-7 py-10">
        {/* 30% - Other Component */}
        <div className="w-[30%]"></div>

        {/* 70% - Profile Component */}
        <div className="w-[70%] flex justify-center">
          <div
            className="
              box-border
              flex
              flex-col
              items-center
              gap-8
              w-full
              max-w-[750px]
              min-h-[1224px]
              px-0
              py-0
              border
              border-[#A9B3BD]
              rounded-lg
            "
          >
            {/* Main Content */}
            <div
              className="
                flex
                flex-col
                items-start
                gap-[51px]
                w-full
                max-w-[748px]
                px-4
                sm:px-6
                lg:px-0
                py-8
              "
            >
              {/* ================= HEADER + PROFILE + STATS ================= */}
              <div
                className="
                  flex
                  flex-col
                  items-start
                  gap-10
                  w-full
                  px-4 
                "
              >
                {/* Header */}
                <div
                  className="
                    flex
                    flex-col
                    justify-center
                    items-center
                    gap-4
                    w-full
                  "
                >
                  <h1
                    className="
                      w-full
                      max-w-[637px]
                      font-['Inter']
                      font-bold
                      text-[32px]
                      leading-[40px]
                      text-black
                    "
                  >
                    My Profile
                  </h1>

                  <p
                    className="
                      w-full
                      max-w-[637px]
                      font-['Inter']
                      font-normal
                      text-[14px]
                      leading-[20px]
                      text-black
                    "
                  >
                    Manage your personal information and account.
                  </p>
                </div>

                {/* Profile Information + Buttons */}
                <div
                  className="
                    flex
                    flex-col
                    xl:flex-row
                    justify-center
                    items-center
                    gap-6
                    w-full
                  "
                >
                  {/* Profile Image + User Information */}
                  <div
                    className="
                      flex
                      flex-row
                      justify-center
                      items-center
                      gap-[19px]
                      w-full
                      xl:w-[395px]
                      h-[184px]
                    "
                  >
                    {/* Profile Image */}
                    <div
                      alt="David profile"
                      className="
                        w-[182px]
                        h-[184px]
                        bg-neutral-300
                        rounded-full 
                        flex-shrink-0
                      "
                    />

                    {/* User Details */}
                    <div
                      className="
                        flex
                        flex-col
                        justify-center
                        items-center
                        gap-1
                        w-[194px]
                        h-[184px]
                      "
                    >
                      <h2
                        className="
                          w-full
                          font-['Inter']
                          font-bold
                          text-[32px]
                          leading-[40px]
                          text-black
                        "
                      >
                        David
                      </h2>

                      <p
                        className="
                          w-full
                          font-['Inter']
                          font-medium
                          text-[14px]
                          leading-[20px]
                          text-black
                        "
                      >
                        myolwin400400@gmail.com
                      </p>

                      <p
                        className="
                          w-full
                          font-['Inter']
                          font-medium
                          text-[14px]
                          leading-[20px]
                          text-black
                        "
                      >
                        Member{" "}
                        <span className="text-[#4B32A8]">since 2026</span>
                      </p>
                    </div>
                  </div>

                  {/* Edit + Setting Buttons */}
                  <div
                    className="
                      flex
                      flex-row
                      items-start
                      gap-8
                      w-[264px]
                      h-[46px]
                    "
                  >
                    <Link
                      to="/edit-profile"
                      className="
                        flex
                        justify-center
                        items-center
                        w-[116px]
                        h-[44px]
                        px-[10px]
                        rounded-lg
                        bg-[#6D4AFF]
                        font-['Inter']
                        font-normal
                        text-[16px]
                        leading-[24px]
                        text-white
                        hover:bg-[#5B3DE0]
                        transition-colors
                      "
                    >
                      Edit Profile
                    </Link>

                    <button
                      type="button"
                      className="
                        box-border
                        flex
                        justify-center
                        items-center
                        w-[116px]
                        h-[46px]
                        px-[10px]
                        rounded-lg
                        border
                        border-[#708090]
                        bg-transparent
                        font-['Inter']
                        font-normal
                        text-[16px]
                        leading-[24px]
                        text-[#4B32A8]
                        hover:bg-[#F3F0FF]
                        transition-colors
                      "
                    >
                      Setting
                    </button>
                  </div>
                </div>

                {/* ================= STATISTICS ================= */}
                <div
                  className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4
                    gap-1
                    w-full
                  "
                >
                  {/* Item Reports */}
                  <div
                    className="
                      box-border
                      flex
                      flex-row
                      justify-center
                      items-center
                      gap-4
                      w-full
                      h-[62px]
                      border
                      border-[#A9B3BD]
                      rounded
                    "
                  >
                    <Flag
                      size={24}
                      strokeWidth={2}
                      className="text-black flex-shrink-0"
                    />

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          font-['Inter']
                          font-semibold
                          text-[24px]
                          leading-[32px]
                          text-black
                        "
                      >
                        6
                      </span>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[14px]
                          leading-[20px]
                          text-black
                          whitespace-nowrap
                        "
                      >
                        Item Reports
                      </span>
                    </div>
                  </div>

                  {/* Items Found */}
                  <div
                    className="
                      box-border
                      flex
                      flex-row
                      justify-center
                      items-center
                      gap-6
                      w-full
                      h-[62px]
                      border
                      border-[#A9B3BD]
                      rounded
                    "
                  >
                    <Search
                      size={24}
                      strokeWidth={2}
                      className="text-black flex-shrink-0"
                    />

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          font-['Inter']
                          font-semibold
                          text-[24px]
                          leading-[32px]
                          text-black
                        "
                      >
                        8
                      </span>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[14px]
                          leading-[20px]
                          text-black
                          whitespace-nowrap
                        "
                      >
                        Items Found
                      </span>
                    </div>
                  </div>

                  {/* Claims Submitted */}
                  <div
                    className="
                      box-border
                      flex
                      flex-row
                      justify-center
                      items-center
                      gap-4
                      w-full
                      h-[62px]
                      border
                      border-[#A9B3BD]
                      rounded
                    "
                  >
                    <Search
                      size={24}
                      strokeWidth={2}
                      className="text-black flex-shrink-0"
                    />

                    <div
                      className="
                        flex
                        flex-col
                        justify-center
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          font-['Inter']
                          font-semibold
                          text-[24px]
                          leading-[32px]
                          text-black
                        "
                      >
                        7
                      </span>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[14px]
                          leading-[20px]
                          text-black
                          whitespace-nowrap
                        "
                      >
                        Claims Submitted
                      </span>
                    </div>
                  </div>

                  {/* Items Returned */}
                  <div
                    className="
                      box-border
                      flex
                      flex-row
                      justify-center
                      items-center
                      gap-4
                      w-full
                      h-[62px]
                      border
                      border-[#A9B3BD]
                      rounded
                    "
                  >
                    <Flag
                      size={24}
                      strokeWidth={2}
                      className="text-black rotate-180 flex-shrink-0"
                    />

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          font-['Inter']
                          font-semibold
                          text-[24px]
                          leading-[32px]
                          text-black
                        "
                      >
                        6
                      </span>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[14px]
                          leading-[20px]
                          text-black
                          whitespace-nowrap
                        "
                      >
                        Items Returned
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= LOWER CONTENT ================= */}
              <div
                className="
                  flex
                  flex-col
                  justify-center
                  items-center
                  gap-[31px]
                  w-full
                "
              >
                {/* ================= ABOUT ME ================= */}
                <div
                  className="
                    box-border
                    flex
                    flex-col
                    justify-center
                    items-center
                    gap-3
                    w-full
                    max-w-[660px]
                    min-h-[119px]
                    px-6
                    border
                    border-[#A9B3BD]
                    rounded-lg
                  "
                >
                  <h3
                    className="
                      w-full
                      max-w-[475px]
                      font-['Inter']
                      font-semibold
                      text-[24px]
                      leading-[32px]
                      text-black
                    "
                  >
                    About Me
                  </h3>

                  <p
                    className="
                      w-full
                      max-w-[475px]
                      font-['Inter']
                      font-normal
                      text-[14px]
                      leading-[20px]
                      text-black
                    "
                  >
                    Hi! I am David. I am from Myanmar.
                  </p>
                </div>

                {/* ================= PERSONAL INFORMATION ================= */}
                <div
                  className="
                    box-border
                    flex
                    flex-col
                    justify-center
                    items-center
                    gap-6
                    w-full
                    max-w-[660px]
                    min-h-[212px]
                    px-6
                    border
                    border-[#A9B3BD]
                    rounded-lg
                  "
                >
                  <h3
                    className="
                      w-full
                      max-w-[459px]
                      font-['Inter']
                      font-semibold
                      text-[24px]
                      leading-[32px]
                      text-black
                    "
                  >
                    Personal Information
                  </h3>

                  <div
                    className="
                      flex
                      flex-col
                      justify-center
                      items-start
                      gap-6
                      w-full
                      max-w-[459px]
                    "
                  >
                    {/* Full Name */}
                    <div
                      className="
                        flex
                        flex-row
                        items-center
                        gap-14
                        w-full
                      "
                    >
                      <div
                        className="
                          flex
                          flex-row
                          items-center
                          gap-3
                          w-[146px]
                          flex-shrink-0
                        "
                      >
                        <UserRound
                          size={20}
                          strokeWidth={2}
                          className="text-[#4B32A8]"
                        />

                        <span
                          className="
                            font-['Inter']
                            font-medium
                            text-[16px]
                            leading-[24px]
                            text-black
                          "
                        >
                          Full Name
                        </span>
                      </div>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[18px]
                          leading-7
                          text-black
                        "
                      >
                        David
                      </span>
                    </div>

                    {/* Email */}
                    <div
                      className="
                        flex
                        flex-row
                        items-center
                        gap-14
                        w-full
                      "
                    >
                      <div
                        className="
                          flex
                          flex-row
                          items-center
                          gap-3
                          w-[146px]
                          flex-shrink-0
                        "
                      >
                        <Mail
                          size={20}
                          strokeWidth={2}
                          className="text-[#4B32A8]"
                        />

                        <span
                          className="
                            font-['Inter']
                            font-medium
                            text-[16px]
                            leading-[24px]
                            text-black
                            whitespace-nowrap
                          "
                        >
                          Email Address
                        </span>
                      </div>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[18px]
                          leading-7
                          text-black
                          break-all
                        "
                      >
                        myolwin400400@gmail.com
                      </span>
                    </div>

                    {/* Phone */}
                    <div
                      className="
                        flex
                        flex-row
                        items-center
                        gap-14
                        w-full
                      "
                    >
                      <div
                        className="
                          flex
                          flex-row
                          items-center
                          gap-3
                          w-[146px]
                          flex-shrink-0
                        "
                      >
                        <Phone
                          size={20}
                          strokeWidth={2}
                          className="text-[#4B32A8]"
                        />

                        <span
                          className="
                            font-['Inter']
                            font-medium
                            text-[16px]
                            leading-[24px]
                            text-black
                            whitespace-nowrap
                          "
                        >
                          Phone Number
                        </span>
                      </div>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[18px]
                          leading-7
                          text-black
                        "
                      >
                        0945609416
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================= SECURITY ================= */}
                <div
                  className="
                    box-border
                    flex
                    flex-col
                    justify-center
                    items-center
                    gap-6
                    w-full
                    max-w-[660px]
                    min-h-[220px]
                    px-6
                    border
                    border-[#A9B3BD]
                    rounded-lg
                  "
                >
                  <h3
                    className="
                      w-full
                      max-w-[461px]
                      font-['Inter']
                      font-semibold
                      text-[24px]
                      leading-[32px]
                      text-black
                    "
                  >
                    Security
                  </h3>

                  <div
                    className="
                      flex
                      flex-col
                      items-start
                      gap-6
                      w-full
                      max-w-[500px]
                    "
                  >
                    {/* Password */}
                    <div
                      className="
                        flex
                        flex-row
                        items-start
                        gap-14
                        w-full
                      "
                    >
                      <div
                        className="
                          flex
                          flex-row
                          items-start
                          gap-3
                          w-[230px]
                          flex-shrink-0
                        "
                      >
                        <KeyRound
                          size={22}
                          strokeWidth={2}
                          className="text-[#4B32A8] mt-0.5"
                        />

                        <div
                          className="
                            flex
                            flex-col
                            items-start
                            gap-1
                          "
                        >
                          <span
                            className="
                              font-['Inter']
                              font-medium
                              text-[16px]
                              leading-[24px]
                              text-black
                            "
                          >
                            Password
                          </span>

                          <span
                            className="
                              font-['Inter']
                              font-medium
                              text-[14px]
                              leading-[20px]
                              text-black
                              whitespace-nowrap
                            "
                          >
                            Last Updated Jan12,2026
                          </span>
                        </div>
                      </div>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[18px]
                          leading-7
                          text-black
                        "
                      >
                        *******
                      </span>

                      <button
                        type="button"
                        className="
                          font-['Inter']
                          font-normal
                          text-[18px]
                          leading-7
                          text-[#4B32A8]
                          hover:underline
                        "
                      >
                        Change
                      </button>
                    </div>

                    {/* Two Factor Authentication */}
                    <div
                      className="
                        flex
                        flex-row
                        items-start
                        gap-14
                        w-full
                      "
                    >
                      <div
                        className="
                          flex
                          flex-row
                          items-start
                          gap-3
                          w-[230px]
                          flex-shrink-0
                        "
                      >
                        <ShieldCheck
                          size={20}
                          strokeWidth={2}
                          className="text-[#4B32A8] mt-0.5"
                        />

                        <span
                          className="
                            font-['Inter']
                            font-medium
                            text-[16px]
                            leading-[24px]
                            text-black
                            whitespace-nowrap
                          "
                        >
                          Two Factor authetication
                        </span>
                      </div>

                      <span
                        className="
                          font-['Inter']
                          font-normal
                          text-[18px]
                          leading-7
                          text-black
                        "
                      >
                        Disabled
                      </span>

                      <button
                        type="button"
                        className="
                          font-['Inter']
                          font-normal
                          text-[18px]
                          leading-7
                          text-[#4B32A8]
                          hover:underline
                        "
                      >
                        Enabled
                      </button>
                    </div>
                  </div>
                </div>

                {/* ================= PRIVACY NOTICE ================= */}
                <div
                  className="
                    flex
                    flex-row
                    justify-center
                    items-center
                    gap-4
                    w-full
                    max-w-[680px]
                    min-h-[72px]
                    px-4
                    bg-[rgba(59,130,246,0.2)]
                    rounded-lg
                  "
                >
                  <Info
                    size={20}
                    strokeWidth={2}
                    className="text-black flex-shrink-0"
                  />

                  <p
                    className="
                      font-['Inter']
                      font-medium
                      text-[14px]
                      leading-5
                      text-black
                    "
                  >
                    Your contact information is private and is only shared with
                    another when a claim is accepted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
