import { Outlet } from "react-router";
import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

const UserLayout = () => {
  return (
    <div className="min-h-screen">
      <UserHeader />

      <main className="pt-[88px]">
        <Outlet />
      </main>

      <UserFooter />
    </div>
  );
};

export default UserLayout;
