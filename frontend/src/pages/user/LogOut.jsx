import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/account/settings");
  };

  const handleLogout = () => {
    // Remove logged-in user information
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("user");

    // Redirect to Home page
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="
          box-border
          w-full
          max-w-[600px]
          min-h-[450px]
          flex
          flex-col
          justify-center
          items-center
          gap-[32px]
          px-6
          mb-32
        "
      >
        <div className="flex justify-center px-4 py-8">
          {/* Main Logout Card */}
          <div
            className="
              box-border
              flex
              h-[362px]
              w-full
              min-w-[504px]
              flex-col
              items-center
              justify-center
              gap-8
              rounded-lg
              border
              border-[#A9B3BD]
              px-6
            "
          >
            {/* Logout Icon */}
            <LogOut size={52} strokeWidth={1.8} className="text-[#4B32A8]" />

            {/* Content */}
            <div
              className="
                flex
                w-full
                flex-col
                items-center
                justify-center
                gap-12
              "
            >
              <div
                className="
                  flex
                  w-full
                  flex-col
                  items-center
                  justify-center
                  gap-4
                "
              >
                <h1
                  className="
                    font-['Inter']
                    text-[32px]
                    font-bold
                    leading-[40px]
                    text-black
                  "
                >
                  Log Out?
                </h1>

                <p
                  className="
                    text-center
                    font-['Inter']
                    text-sm
                    font-normal
                    leading-5
                    text-black
                  "
                >
                  Are you sure you want to log out of lostfound?
                </p>
              </div>

              {/* Buttons */}
              <div className="flex w-full items-center justify-center gap-[34px]">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    box-border
                    flex
                    h-[46px]
                    w-[150px]
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#A9B3BD]
                    bg-transparent
                    px-2.5
                    py-2.5
                    font-['Inter']
                    text-base
                    font-normal
                    leading-6
                    text-black
                    transition-colors
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

                {/* Log Out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    box-border
                    flex
                    h-[44px]
                    w-[150px]
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#6D4AFF]
                    px-2.5
                    py-2.5
                    font-['Inter']
                    text-base
                    font-normal
                    leading-6
                    text-white
                    transition-colors
                    hover:bg-[#5B3DE0]
                  "
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
