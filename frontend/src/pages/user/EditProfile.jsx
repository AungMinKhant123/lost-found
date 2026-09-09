import React, { useState } from "react";
import { Link } from "react-router";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    fullName: "David",
    email: "myolwin400400@gmail.com",
    phone: "0945609416",
    about: "I am David. I am from Myanmar.",
  });

  const [profileImage, setProfileImage] = useState("/assets/profilep1.png");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Profile updated:", formData);
  };

  return (
    <>
      <div className="flex gap-7 py-10">
        {/* ================= 30% - OTHER COMPONENT ================= */}
        <div className="w-[30%]"></div>

        {/* ================= 70% - EDIT PROFILE ================= */}
        <div className="w-[70%] flex justify-center">
          <div
            className="
              box-border
              flex
              flex-col
              justify-center
              items-center
              w-full
              max-w-[768px]
              min-h-[938px]
              px-4
              sm:px-6
              lg:px-8
              border
              border-[#A9B3BD]
              rounded-lg
            "
          >
            {/* ================= MAIN CONTENT ================= */}
            <form
              onSubmit={handleSubmit}
              className="
                flex
                flex-col
                items-start
                w-full
                max-w-[679px]
                gap-8
                py-8
              "
            >
              {/* ================= HEADER ================= */}
              <div
                className="
                  flex
                  flex-col
                  items-start
                  gap-4
                  w-full
                "
              >
                <h1
                  className="
                    w-full
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
                    font-['Inter']
                    font-normal
                    text-[14px]
                    leading-[20px]
                    text-black
                  "
                >
                  Upload your personal information and keep your account secure
                </p>
              </div>

              {/* ================= PROFILE PHOTO ================= */}
              <div
                className="
                  flex
                  flex-row
                  items-center
                  gap-3
                  w-full
                  h-[184px]
                "
              >
                {/* Profile Image */}
                <img
                  src={profileImage}
                  alt="Profile"
                  className="
                    w-[182px]
                    h-[184px]
                    rounded-full
                    object-cover
                    bg-neutral-300
                    flex-shrink-0
                  "
                />
                {/* <div 
                  alt="David profile"
                  className="
                        w-[182px]
                        h-[184px]
                        bg-neutral-300
                        rounded-full 
                        flex-shrink-0
                      "
                /> */}

                {/* Change Photo */}
                <label
                  htmlFor="profile-photo"
                  className="
                    font-['Inter']
                    font-medium
                    text-[16px]
                    leading-[24px]
                    text-[#4B32A8]
                    cursor-pointer
                    hover:underline
                  "
                >
                  Change Photo
                </label>

                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* ================= FORM FIELDS ================= */}
              <div
                className="
                  flex
                  flex-col
                  justify-center
                  items-start
                  gap-5
                  w-full
                "
              >
                {/* ================= FULL NAME ================= */}
                <div
                  className="
                    flex
                    flex-col
                    items-start
                    gap-[10px]
                    w-full
                  "
                >
                  <label
                    htmlFor="fullName"
                    className="
                      font-['Inter']
                      font-medium
                      text-[16px]
                      leading-[24px]
                      text-black
                    "
                  >
                    Full Name <span className="text-[#DC2626]">*</span>
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="
                      box-border
                      w-full
                      h-10
                      px-4
                      bg-white
                      border
                      border-[#A9B3BD]
                      rounded-lg
                      outline-none
                      text-center
                      font-['Inter']
                      font-medium
                      text-[14px]
                      leading-[20px]
                      text-[#708090]
                      focus:border-[#4B32A8]
                      focus:ring-1
                      focus:ring-[#4B32A8]
                    "
                  />
                </div>

                {/* ================= EMAIL ================= */}
                <div
                  className="
                    flex
                    flex-col
                    items-start
                    gap-[10px]
                    w-full
                  "
                >
                  <label
                    htmlFor="email"
                    className="
                      font-['Inter']
                      font-medium
                      text-[16px]
                      leading-[24px]
                      text-black
                    "
                  >
                    Email Address <span className="text-[#DC2626]">*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                    className="
                      box-border
                      w-full
                      h-10
                      px-4
                      bg-white
                      border
                      border-[#A9B3BD]
                      rounded-lg
                      outline-none
                      text-center
                      font-['Inter']
                      font-medium
                      text-[14px]
                      leading-[20px]
                      text-[#708090]
                      focus:border-[#4B32A8]
                      focus:ring-1
                      focus:ring-[#4B32A8]
                    "
                  />
                </div>

                {/* ================= PHONE NUMBER ================= */}
                <div
                  className="
                    flex
                    flex-col
                    items-start
                    gap-[10px]
                    w-full
                  "
                >
                  <label
                    htmlFor="phone"
                    className="
                      font-['Inter']
                      font-medium
                      text-[16px]
                      leading-[24px]
                      text-black
                    "
                  >
                    Phone Number <span className="text-[#DC2626]">*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={20}
                    className="
                      box-border
                      w-full
                      h-10
                      px-4
                      bg-white
                      border
                      border-[#A9B3BD]
                      rounded-lg
                      outline-none
                      text-center
                      font-['Inter']
                      font-medium
                      text-[14px]
                      leading-[20px]
                      text-[#708090]
                      focus:border-[#4B32A8]
                      focus:ring-1
                      focus:ring-[#4B32A8]
                    "
                  />
                </div>

                {/* ================= ABOUT ME ================= */}
                <div
                  className="
                    flex
                    flex-col
                    items-end
                    gap-1
                    w-full
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      items-start
                      gap-1
                      w-full
                    "
                  >
                    <label
                      htmlFor="about"
                      className="
                        w-full
                        font-['Inter']
                        font-medium
                        text-[16px]
                        leading-[24px]
                        text-black
                      "
                    >
                      About Me
                    </label>

                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      maxLength={100}
                      rows={3}
                      className="
                        box-border
                        w-full
                        h-[84px]
                        px-[10px]
                        py-[10px]
                        resize-none
                        border
                        border-[#A9B3BD]
                        rounded-lg
                        outline-none
                        text-center
                        font-['Inter']
                        font-medium
                        text-[16px]
                        leading-[24px]
                        text-[#708090]
                        focus:border-[#4B32A8]
                        focus:ring-1
                        focus:ring-[#4B32A8]
                      "
                    />
                  </div>

                  {/* Character Counter */}
                  <span
                    className="
                      font-['Inter']
                      font-normal
                      text-[14px]
                      leading-[20px]
                      text-black
                    "
                  >
                    {formData.about.length}/100
                  </span>
                </div>
              </div>

              {/* ================= BUTTONS ================= */}
              <div
                className="
                  flex
                  flex-row
                  justify-center
                  items-center
                  gap-[34px]
                  w-full
                  h-[46px]
                "
              >
                {/* Cancel */}
                <Link
                  to="/profile/1"
                  className="
                    box-border
                    flex
                    justify-center
                    items-center
                    w-[116px]
                    h-[46px]
                    px-[10px]
                    border
                    border-[#A9B3BD]
                    rounded-lg
                    font-['Inter']
                    font-normal
                    text-[16px]
                    leading-[24px]
                    text-black
                    hover:bg-gray-50
                    transition-colors
                  "
                >
                  Cancel
                </Link>

                {/* Save Changes */}
                <button
                  type="submit"
                  className="
                    flex
                    justify-center
                    items-center
                    w-[150px]
                    h-[44px]
                    px-[10px]
                    bg-[#6D4AFF]
                    rounded-lg
                    font-['Inter']
                    font-normal
                    text-[16px]
                    leading-[24px]
                    text-white
                    hover:bg-[#5B3DE0]
                    transition-colors
                  "
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
