import React from "react";
import DecorativeBackground from "../../components/DecorativeBackground/DecorativeBackground";

const teamMembers = [
  {
    name: "Mohamed Ashfaqu Ifthicar",
    role: "(Frontend Developer & Project Owner)",
    image:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923770/4d41e8252bb97c408baccee3b0f15a433fc9dac0_1_bhhesd.jpg",
    description:
      "Basically, the idea behind LostFound came from noticing how difficult it can be to find something after losing it around campus. So I wanted to create one simple platform where people can post about lost or found items with details like photos, location, and date. Then other students can easily search through the posts and contact the person or make a claim if they find their item. The main idea is just to make the whole lost-and-found process quicker, easier, and more organized.",
  },
  {
    name: "Aung Min Khant",
    role: "(Project Manager & Tester)",
    image:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923771/394a60e48359b11938225a5423b51269758c633d_qtr6nk.png",
    description:
      "Joining the LostFound project as part of the project management and QA testing team gives me the opportunity to blend process organisation with quality control. I am passionate about ensuring our web app runs smoothly so students and staff can effortlessly recover their misplaced belongings. By driving the project timeline and testing every feature, I help deliver a reliable, user-friendly platform tailored to our campus's daily needs. Ultimately, I am taking part in this initiative because I want to turn a stressful campus problem into a seamless, technology-driven solution.",
  },
  {
    name: "May Phu San",
    role: "(Project Manager & UI/UX Designer)",
    image:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923821/1f18b6522add5a0acd4e9ee21fc9be1e3b307509_slskmh.jpg",
    description:
      "Main idea is to create a simple platform that makes reporting and finding lost items easier. We noticed that people often have to rely on social media or word of mouth, which can make it difficult to find the right information. So, basically, we want to provide one organized platform where users can report, search, claim and connect with the right person. From my role, I’m trying to focus on making the user experience simple and intuitive while also trying to help the team planning and organize the project effectively.",
  },
  {
    name: "Myint Mo Kyaw",
    role: "(Frontend Developer)",
    image:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923792/3acb57ea44b0e2a79241655a31d3058645f25393_xts4y3.jpg",
    description:
      "I worked as a frontend developer on the Lost & Found project because I wanted hands-on experience building a clean, responsive web application from the ground up. My focus was on creating a smooth user experience from designing form validation and photo previews to building search filters. This role gave me the perfect opportunity to sharpen my frontend skills, master team workflows using Git and GitHub, and learn how to seamlessly connect user interfaces with backend APIs.",
  },
  {
    name: "Htet Min Myat",
    role: "(Backend Developer)",
    image:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923775/70a3503028a7ef8f33b6d1f45a3641a8ec5d8915_1_fwesh4.jpg",
    description:
      "The Lost & Found project is a platform designed to make it easier for people to report, search for, and recover lost items in one organized place. I joined this project as a backend developer because I wanted to contribute to building the core system that makes these features work smoothly. My main focus is developing the APIs, managing the database, and implementing the business logic while working with the team to make the platform reliable and easy to use.",
  },
  {
    name: "Hein Min Htet",
    role: "(Backend Developer)",
    image:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923780/133eb337d364fc8a691dc7b3b17d8db2c5e69334_ygigkf.png",
    description:
      "I chose backend development because I’m interested in what happens behind the user interface. I like working with APIs, databases, authentication, and the logic that makes the application actually function. I also took QA because I think building a feature and making sure it works correctly are closely connected. Testing also helps me understand the system from the user's perspective.",
  },

  {
    name: "Myo Lwin",
    role: "(UI/UX Designer)",
    image:
      "https://res.cloudinary.com/d5tnusci/image/upload/v1789923771/98f2505a5bcb541576ef404fdcaddda39be55ccb_izqpfo.jpg",
    description:
      "Lostfound is the Web App we really need in recently. My attention to this website is to make it more attractive to the users and can deliver to the person who is belonged to that items.",
  },
];


function TeamMember({ member, index }) {
  const reverse = index % 2 === 1;

  return (
    <div
      className={`
        relative
        z-10
        mx-auto
        flex
        w-full
        max-w-[953px]
        flex-col
        items-center
        gap-7
        px-5
        lg:gap-[24px]
        lg:px-0
        ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}
      `}
    >
      {/* PROFILE IMAGE */}
      <div
        className="
          h-[150px]
          w-[150px]
          shrink-0
          overflow-hidden
          rounded-full
          sm:h-[210px]
          sm:w-[210px]
          md:h-[260px]
          md:w-[260px]
          lg:h-[464px]
          lg:w-[464px]
        "
      >
        <img
          src={member.image}
          alt={member.name}
          className="
            h-full
            w-full
            bg-neutral-100
            object-cover
          "
        />
      </div>

      {/* TEXT */}
      <div
        className="
          flex
          w-full
          max-w-[457px]
          flex-col
          items-center
          gap-5
          lg:gap-[22px]
        "
      >
        {/* NAME + ROLE */}
        <div className="flex w-full flex-col items-center gap-1">
          <div
            className="
              flex
              w-full
              flex-col
              items-center
              justify-center
              gap-2
              px-2
            "
          >
            <h2
              className="
                m-0
                w-full
                text-center
                text-[24px]
                font-bold
                leading-tight
                text-black
                sm:text-[28px]
                lg:text-[32px]
                lg:leading-[40px]
              "
            >
              {member.name}
            </h2>

            <p
              className="
                m-0
                w-full
                text-center
                text-[15px]
                font-normal
                leading-7
                text-black
                sm:text-[16px]
                lg:text-[18px]
              "
            >
              {member.role}
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p
          className="
            m-0
            w-full
            max-w-[418px]
            text-center
            text-[15px]
            font-normal
            leading-[26px]
            text-black
            sm:text-[16px]
            lg:text-left
            lg:text-[18px]
            lg:leading-[28px]
          "
        >
          {member.description}
        </p>
      </div>
    </div>
  );
}

export default function AboutUs() {
  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#F8FAFC]
        font-sans
      "
    >
      <DecorativeBackground variant="aboutUs" />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
    relative
    h-[455px]
    w-full
    overflow-hidden
    bg-[#604AB1]
    sm:h-[490px]
    lg:h-[490px]
  "
      >
        <div
          className="
      relative
      mx-auto
      flex
      h-full
      w-full
      max-w-[1280px]
      flex-row
      items-start
      px-[24px]
      sm:px-8
      lg:px-0
    "
        >
          {/* TEXT BLOCK */}
          <div
            className="
        relative
        z-20
        mt-[28px]
        flex
        w-[65%]
        shrink-0
        flex-col
        text-left
        sm:mt-[60px]
        lg:absolute
        lg:left-[180px]
        lg:top-[110px]
        lg:mt-0
        lg:w-[52%]
        lg:max-w-[686px]
      "
          >
            {/* HEADING */}
            <div className="flex flex-col gap-[10px] lg:gap-[12px]">
              <h1
                className="
            m-0
            text-[23px]
            font-bold
            leading-[1.25]
            text-white
            sm:text-[36px]
            md:text-[44px]
            lg:whitespace-nowrap
            lg:text-[53px]
            lg:leading-[54px]
          "
              >
                More than just lost and found
              </h1>

              <h2
                className="
            m-0
            text-[22px]
            font-bold
            leading-[1.3]
            text-black
            sm:text-[32px]
            md:text-[40px]
            lg:text-[48px]
            lg:leading-[48px]
          "
              >
                — we're a community.
              </h2>
            </div>

            {/* DESCRIPTION */}
            <p
              className="
          m-0
          mt-[16px]
          w-full
          text-[12px]
          font-normal
          leading-[18px]
          text-white
          sm:text-[15px]
          sm:leading-[25px]
          lg:max-w-[626px]
          lg:text-[18px]
          lg:leading-[28px]
        "
            >
              LostFound is a simple and secure platform designed to help people
              report lost items, share found items, and reconnect belongings
              with their rightful owners.
            </p>

            {/* BUTTON */}
            <button
              className="
          mt-[22px]
          flex
          h-[42px]
          w-fit
          min-w-[150px]
          items-center
          justify-center
          rounded-[12px]
          border
          border-[#A9B3BD]
          bg-[#F8FAFC]
          px-[10px]
          text-[12px]
          font-medium
          text-[#4B32A8]
          transition
          hover:shadow-lg
          sm:mt-[28px]
          sm:h-[54px]
          sm:min-w-[175px]
          sm:text-[14px]
          lg:h-[64px]
          lg:w-[185px]
        "
            >
              See Recent Reunion
            </button>
          </div>

          {/* HERO IMAGE */}
          <div
            className="
        absolute
        right-[-12px]
        top-[145px]
        z-10
        w-[43%]
        sm:right-0
        sm:top-[125px]
        sm:w-[42%]
        lg:left-[73%]
        lg:right-auto
        lg:top-[55px]
        lg:w-[630px]
        lg:translate-x-[15%]
      "
          >
            <img
              src="https://res.cloudinary.com/d5tnusci/image/upload/v1789382320/signup_i2xqdg.png"
              alt="LostFound items"
              className="
          h-auto
          w-full
          object-contain
        "
            />
          </div>
        </div>

        {/* WAVE */}
        <svg
          className="
      absolute
      bottom-[-1px]
      left-0
      z-10
      h-[100px]
      w-full
      sm:h-[120px]
      lg:h-[145px]
    "
          viewBox="0 0 1280 145"
          preserveAspectRatio="none"
        >
          <path
            d="
        M 0 5
        C 55 105, 120 142, 215 142
        C 360 142, 470 85, 610 52
        C 770 14, 875 28, 970 52
        C 1080 82, 1180 115, 1280 145
        L 1280 145
        L 0 145
        Z
      "
            fill="#F8FAFC"
          />
        </svg>
      </section>

      {/* =====================================================
          STORY / TITLE
      ====================================================== */}

      <section
        className="
          relative
          mx-auto
          w-full
          max-w-[1280px]
        "
      >
        <div
          className="
            px-5
            pb-8
            pt-[75px]
            sm:px-8
            sm:pt-[95px]
            lg:ml-[174px]
            lg:px-0
            lg:pb-[40px]
            lg:pt-[120px]
          "
        >
          <p
            className="
              m-0
              mb-2
              text-[16px]
              font-semibold
              leading-7
              text-black
              sm:text-[20px]
              lg:text-[24px]
              lg:leading-[32px]
            "
          >
            OUR STORY & MEET OUR TEAMS
          </p>

          <h2
            className="
              m-0
              text-[30px]
              font-bold
              leading-[1.2]
              text-[#4B32A8]
              sm:text-[38px]
              lg:text-[48px]
              lg:leading-[56px]
            "
          >
            Why we created LostFound
          </h2>
        </div>
      </section>

      {/* =====================================================
          TEAM SECTION
      ====================================================== */}

      <section
        className="
          relative
          w-full
          pb-[80px]
          sm:pb-[110px]
          lg:pb-[140px]
        "
      >
        <div
          className="
            relative
            z-10
            space-y-[90px]
            sm:space-y-[120px]
            lg:space-y-[190px]
          "
        >
          {teamMembers.map((member, index) => (
            <TeamMember key={member.name} member={member} index={index} />
          ))}
        </div>
      </section>

      {/* =====================================================
          CLOSING STATEMENT
      ====================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1280px]
          px-5
          pb-[90px]
          pt-[45px]
          text-center
          sm:px-8
          sm:pb-[110px]
          sm:pt-[60px]
          lg:px-0
          lg:pb-[140px]
          lg:pt-[75px]
        "
      >
        <h2
          className="
            m-0
            mb-4
            text-[25px]
            font-bold
            leading-[1.35]
            text-black
            sm:text-[29px]
            lg:text-[32px]
            lg:leading-[36px]
          "
        >
          Built around people, not just items.
        </h2>

        <p
          className="
            mx-auto
            m-0
            max-w-[720px]
            text-[14px]
            font-normal
            leading-[26px]
            text-black
            sm:text-[16px]
            sm:leading-[28px]
            lg:text-[18px]
          "
        >
          Every item has a story. Behind every lost phone, backpack, wallet, or
          set of keys is a person hoping to get it back. LostFound is designed
          to make that connection easier, safer, and more meaningful.
        </p>
      </section>
    </div>
  );
}
