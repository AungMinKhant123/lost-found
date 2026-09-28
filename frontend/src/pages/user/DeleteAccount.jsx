import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useLogout } from "../../hooks/useLogout";
import { deleteUserAccount, isRealBackendUserId } from "../../services/api";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const performLogout = useLogout();
  const user = useAuthStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancel = () => {
    navigate("/account/settings");
  };

  const handleDeleteAccount = async () => {
    // There is no delete-account endpoint on the real backend that we
    // know of yet, so we can't (and shouldn't) guess one. Until it
    // exists, deletion only works for json-server (mock) accounts.
    // Real backend accounts get a clear message instead of a silent no-op.
    const isMockAccount = user?.id && !isRealBackendUserId(user.id);

    if (!isMockAccount) {
      toast.error(
        "Deleting this account isn't available yet — it needs the backend's delete-account endpoint.",
      );
      return;
    }

    setIsDeleting(true);
    try {
      // Removes the user, their posts, and all related claims.
      await deleteUserAccount(user.id);

      // Then log out exactly like the normal logout does.
      performLogout();

      toast.success("Your account has been deleted.");
      navigate("/login");
    } catch (err) {
      console.error("Delete account failed:", err);
      toast.error("Couldn't delete your account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
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
            {/* Delete Icon */}
            <Trash2 size={52} strokeWidth={1.8} className="text-[#DC2626]" />

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
                  Delete Account
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
                  Are you sure you want to delete your account? This account
                  cannot be undone.
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

                {/* Delete Account */}
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="
                box-border
                flex
                h-[44px]
                w-[150px]
                items-center
                justify-center
                rounded-lg
                bg-[#DC2626]
                px-2.5
                py-2.5
                font-['Inter']
                text-base
                font-normal
                leading-6
                text-white
                transition-colors
                hover:bg-[#B91C1C]
              "
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
