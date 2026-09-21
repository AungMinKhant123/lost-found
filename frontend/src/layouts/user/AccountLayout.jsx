import { Outlet } from "react-router";
import AccountSidebar from "../../components/user/AccountSidebar";

import DecorativeBackground from "../../components/DecorativeBackground/DecorativeBackground";
import { useProfile } from "../../hooks/useProfile";

const AccountLayout = () => {
  const { data: user, isLoading, isError } = useProfile();

  return (
    <div className="max-w-[1280px] mx-auto px-10 py-10 relative">
      <DecorativeBackground variant="account" />

      <div className="flex gap-8 items-start relative z-10">
        {isLoading ? (
          <div className="w-full max-w-xs text-body-sm text-text-secondary">
            Loading...
          </div>
        ) : (
          <AccountSidebar
            name={
              user
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                : undefined
            }
            email={user?.email}
          />
        )}

        <div className="flex-1 min-h-[600px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
