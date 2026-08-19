import { Outlet } from 'react-router';
import UserHeader from '../../components/user/UserHeader';
import UserFooter from '../../components/user/UserFooter';

const UserLayout = () => {
  return (
    <>
      <UserHeader />

      <main>
        <Outlet />
      </main>

      <UserFooter />
    </>
  );
};

export default UserLayout;
