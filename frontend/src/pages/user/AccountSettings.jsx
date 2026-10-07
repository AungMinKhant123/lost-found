import { Link, useNavigate } from "react-router";
import { UserRound, KeyRound, Bell, LogOut, Trash2 } from "lucide-react";

const AccountSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Go back to login page
    navigate("/account/logout");
  };

  const handleDeleteAccount = () => {
    navigate("/account/delete-account");
  };

  return (
    <div className="flex justify-center px-4 py-8 ">
      {/* Main Settings Card */}
      <div
        className="
          box-border
          flex
          w-full
          max-w-[750px]
          flex-col
          items-center
          justify-center
          gap-5 sm:gap-10
          rounded-lg
          bg-white
          border
          border-[#A9B3BD]
         px-4
py-6
sm:px-6
sm:py-8
        "
      >
        {/* Header */}
        <div className="flex w-full max-w-[673px] flex-col items-start gap-4">
          <h1 className="font-['Inter'] text-[28px] sm:text-[32px] font-bold leading-[36px] sm:leading-[40px] text-black  ">
            Setting
          </h1>

          <p className="font-['Inter'] text-base font-medium leading-6 text-black">
            Manage your account and preferences.
          </p>
        </div>

        {/* Settings Options */}
        <div className="flex w-full flex-col items-stretch sm:items-center gap-3.5 sm:gap-6">
          {/* Profile */}
          <Link
            to="/account"
            className="
              box-border
              flex
              h-auto sm:h-[93px] min-h-[93px] py-4  sm:py-0
              w-full
              max-w-[632px]
              items-center
              justify-center
              gap-6
              rounded-xl
              border
              border-[#A9B3BD]
              transition-colors
              hover:bg-gray-50
              px-3
            "
          >
            <div className="flex w-full max-w-[421px] items-center gap-3 sm:gap-4">
              <UserRound
                size={24}
                strokeWidth={2}
                className="shrink-0 text-[#4B32A8]"
              />

              <div className="flex flex-1 flex-col items-start gap-2">
                <h2 className="font-['Inter'] text-xl sm:text-2xl  font-semibold leading-7 sm:leading-8 text-black ">
                  Profile
                </h2>

                <p className="font-['Inter'] text-sm sm:text-base font-medium leading-5 sm:leading-6 text-black  ">
                  Update your personal information.
                </p>
              </div>

              <span className="px-1.5 py-2.5 font-['Inter'] text-lg font-normal leading-7 text-black sm:px-2.5">
                &gt;
              </span>
            </div>
          </Link>

          {/* Change Password */}
          <Link
            to="/account/change-password"
            className="
              box-border
              flex
              h-auto sm:h-[93px] min-h-[93px] py-4  sm:py-0
              w-full
              max-w-[632px]
              items-center
              justify-center
              gap-6
              rounded-xl
              border
              border-[#A9B3BD]
              transition-colors
              hover:bg-gray-50
              px-3
            "
          >
            <div className="flex w-full max-w-[421px] items-center gap-4">
              <KeyRound
                size={24}
                strokeWidth={2}
                className="shrink-0 text-[#4B32A8]"
              />

              <div className="flex flex-1 flex-col items-start gap-2">
                <h2 className="font-['Inter'] text-xl sm:text-2xl  font-semibold leading-7 sm:leading-8 text-black ">
                  {" "}
                  Change Password
                </h2>

                <p className="font-['Inter'] text-sm sm:text-base font-medium leading-5 sm:leading-6 text-black  ">
                  Keep your account secure.
                </p>
              </div>

              <span className="px-1.5 py-2.5 font-['Inter'] text-lg font-normal leading-7 text-black sm:px-2.5">
                &gt;
              </span>
            </div>
          </Link>

          {/* Notification Preferences */}
          <Link
            to="/account/notifications"
            className="
                    box-border
                    flex
                    h-auto sm:h-[93px] min-h-[93px] py-4  sm:py-0
                    w-full
                    max-w-[632px]
                    items-center
                    justify-center
                    gap-6
                    rounded-xl
                    border
                    border-[#A9B3BD]
                    transition-colors
                    hover:bg-gray-50
                    px-3
                  "
          >
            <div className="flex w-full max-w-[421px] items-center gap-4">
              <Bell
                size={24}
                strokeWidth={2}
                className="shrink-0 text-[#4B32A8]"
              />

              <div className="flex flex-1 flex-col items-start gap-2">
                <h2 className="font-['Inter'] text-xl sm:text-2xl  font-semibold leading-7 sm:leading-8 text-black ">
                  {" "}
                  Notification
                </h2>

                <p className="font-['Inter'] text-sm sm:text-base font-medium leading-5 sm:leading-6 text-black  ">
                  Manage your email notification
                </p>
              </div>

              <span className="px-1.5 py-2.5 font-['Inter'] text-lg font-normal leading-7 text-black sm:px-2.5">
                &gt;
              </span>
            </div>
          </Link>

          {/* Log Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              box-border
              flex
              h-auto sm:h-[93px] min-h-[93px] py-4  sm:py-0
              w-full
              max-w-[632px]
              items-center
              justify-center
              gap-6
              rounded-xl
              border
              border-[#A9B3BD]
              bg-transparent
              text-left
              transition-colors
              hover:bg-gray-50
              px-3
            "
          >
            <div className="flex w-full max-w-[421px] items-center gap-4">
              <LogOut
                size={24}
                strokeWidth={2}
                className="shrink-0 text-[#4B32A8]"
              />

              <div className="flex flex-1 flex-col items-start gap-2">
                <h2 className="font-['Inter'] text-xl sm:text-2xl  font-semibold leading-7 sm:leading-8 text-black ">
                  {" "}
                  Log Out
                </h2>

                <p className="font-['Inter'] text-sm sm:text-base font-medium leading-5 sm:leading-6 text-black  ">
                  Log Out from your account.
                </p>
              </div>

              <span className="px-1.5 py-2.5 font-['Inter'] text-lg font-normal leading-7 text-black sm:px-2.5">
                &gt;
              </span>
            </div>
          </button>

          {/* Delete Account */}
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="
              box-border
              flex
              h-auto sm:h-[93px] min-h-[93px] py-4  sm:py-0
              w-full
              max-w-[632px]
              items-center
              justify-center
              gap-6
              rounded-xl
              border
              border-[#DC2626]
              bg-transparent
              text-left
              transition-colors
              hover:bg-red-50
              px-3
            "
          >
            <div className="flex w-full max-w-[421px] items-center gap-4">
              <Trash2
                size={24}
                strokeWidth={2}
                className="shrink-0 text-[#DC2626]"
              />

              <div className="flex flex-1 flex-col items-start gap-2">
                <h2 className="font-['Inter'] text-xl font-semibold leading-7 text-[#DC2626] sm:text-2xl sm:leading-8">
                  Delete Account
                </h2>

                <p className="font-['Inter'] text-sm sm:text-base font-medium leading-5 sm:leading-6 text-black  ">
                  Permanently delete your account.
                </p>
              </div>

              <span className="px-1.5 py-2.5 font-['Inter'] text-lg font-normal leading-7  sm:px-2.5 text-[#DC2626]">
                &gt;
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
