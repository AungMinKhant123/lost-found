import React from "react";
import { useNavigate } from "react-router";

export default function PasswordUpdated() {
  const navigate = useNavigate();


  const handleBackToProfile = () => {
    navigate("/account");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div
        className="
          box-border
          w-full
          max-w-[600px]
          min-h-[450px]
          border
          border-[#A9B3BD]
          rounded-[8px]
          bg-[#F8FAFC]
          flex
          flex-col
          justify-center
          items-center
          gap-[32px]
          px-6
          mb-32
        "
      >
        {/* Success Icon */}
        <div className="w-[110px] h-[110px] flex items-center justify-center">
          <div
            className="
              w-[110px]
              h-[110px]
              rounded-full
              border-[7px]
              border-[#F2F2F2]
              flex
              items-center
              justify-center
            "
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 36L30 48L55 22"
                stroke="#0EB656"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Text Section */}
        <div
          className="
            w-full
            flex
            flex-col
            justify-center
            items-center
            gap-[16px]
          "
        >
          <h1
            className="
              text-[32px]
              leading-[40px]
              font-bold
              text-center
              text-black
            "
          >
            Password Updated
          </h1>

          <p
            className="
              text-[18px]
              leading-[28px]
              font-normal
              text-center
              text-black
            "
          >
            Your password has been changed successfully.
          </p>
        </div>

        {/* Back to Profile Button */}
        <button
          type="button"
          onClick={handleBackToProfile}
          className="
            w-[208px]
            h-[60px]
            bg-[#6D4AFF]
            rounded-[8px]
            text-white
            text-[20px]
            leading-[24px]
            font-normal
            hover:bg-[#5B3BE0]
            active:bg-[#4F32C9]
            transition
          "
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
