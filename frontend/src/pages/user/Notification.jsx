import { useState } from "react";
import { UserRound, KeyRound, Bell } from "lucide-react";
import { useNavigate } from "react-router";

const Notification = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    claimReceived: true,
    claimAccepted: true,
    claimDeclined: true,
    newPostUpdates: false,
  });

  const handleToggle = (name) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSave = () => {
    console.log("Notification preferences:", notifications);

    // You can connect this to json-server later
  };

  const handleCancel = () => {
    navigate("/account/settings");
  };

  return (
    <div className="flex justify-center px-4 py-8 ">
      {/* Main Notification Card */}
      <div
        className="
          box-border
          flex
          w-full
          max-w-[749px]
          flex-col
          items-center
          justify-center
          gap-6
          bg-white
          rounded-lg
          border
          border-[#A9B3BD]
          px-4
          py-6 sm:py-8
        "
      >
        {/* Content */}
        <div className="flex w-full max-w-[645px] flex-col items-start gap-8 sm:gap-[37px]">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-4">
            <h1
              className="
              font-['Inter']
              text-[28px]
              font-bold
              leading-[36px]
              text-black
              sm:text-[32px]
              sm:leading-[40px]
            "
            >
              Notification Preferences
            </h1>

            <p
              className="
                font-['Inter']
                text-base
                font-medium
                leading-6
                text-black
              "
            >
              Choose what email notification you want to receive
            </p>
          </div>

          {/* Notification Options */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* Claim Received */}
            <NotificationItem
              icon={<UserRound size={24} strokeWidth={2} />}
              title="Claim received"
              description="When someone admits a claim on your post."
              enabled={notifications.claimReceived}
              onToggle={() => handleToggle("claimReceived")}
            />

            {/* Claim Accepted */}
            <NotificationItem
              icon={<KeyRound size={24} strokeWidth={2} />}
              title="Claim accepted"
              description="When your claim is accepted."
              enabled={notifications.claimAccepted}
              onToggle={() => handleToggle("claimAccepted")}
            />

            {/* Claim Declined */}
            <NotificationItem
              icon={<Bell size={24} strokeWidth={2} />}
              title="Claim declined"
              description="When your claim is declined"
              enabled={notifications.claimDeclined}
              onToggle={() => handleToggle("claimDeclined")}
            />

            {/* New Post Updates */}
            <NotificationItem
              icon={<Bell size={24} strokeWidth={2} />}
              title="New Post Updates"
              description="When new post is updated"
              enabled={notifications.newPostUpdates}
              onToggle={() => handleToggle("newPostUpdates")}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex w-full max-w-[564px] items-center gap-2 sm:gap-4">
          {/* Cancel */}
          <button
            type="button"
            onClick={handleCancel}
            className="
              box-border
              flex
              h-[49px]
              w-full
              sm:w-[274px]
              items-center
              justify-center
              rounded-lg
              border
              border-[#A9B3BD]
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

          {/* Save Changes */}
          <button
            type="button"
            onClick={handleSave}
            className="
              box-border
              flex
              h-[49px]
              w-full
              sm:w-[274px]
              items-center
              justify-center
              rounded-lg
              border
              border-[#6D4AFF]
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
              text-nowrap
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* Notification Item */
const NotificationItem = ({ icon, title, description, enabled, onToggle }) => {
  return (
    <div
      className="
        box-border
        flex
        h-auto min-h-[93px] sm:h-[93px] py-4 sm:py-0
        w-full
        max-w-[632px]
        items-center
        justify-center
        gap-4 sm:gap-12
        rounded-xl
        border
        border-[#A9B3BD]
        px-6
      "
    >
      {/* Left Content */}
      <div className="flex w-full max-w-[421px] items-center gap-4">
        {/* Icon */}
        <div className="shrink-0 text-[#4B32A8]">{icon}</div>

        {/* Text */}
        <div className="flex flex-1 flex-col items-start gap-2">
          <h2
            className="
            font-['Inter']
            text-xl
            font-semibold
            leading-7
            text-black
            sm:text-2xl
            sm:leading-8
          "
          >
            {title}
          </h2>

          <p
            className="
            font-['Inter']
            text-sm
            font-medium
            leading-5
            text-black
            sm:text-base
            sm:leading-6
          "
          >
            {description}
          </p>
        </div>
      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Turn ${title} ${enabled ? "off" : "on"}`}
        className="flex shrink-0 items-center justify-center cursor-pointer"
      >
        <div
          className={`
            relative
            h-[20px]
            w-[32px]
            rounded-full
            border-2
            transition-colors
            ${enabled ? "border-[#4B32A8]" : "border-[#A9B3BD]"}
          `}
        >
          {/* Toggle Circle */}
          <div
            className={`
              absolute
              top-1/2
              h-[10px]
              w-[10px]
              -translate-y-1/2
              rounded-full
              border-2
              transition-all
              ${
                enabled
                  ? "right-[2px] border-[#4B32A8]"
                  : "left-[2px] border-[#A9B3BD]"
              }
            `}
          />
        </div>
      </button>
    </div>
  );
};

export default Notification;
