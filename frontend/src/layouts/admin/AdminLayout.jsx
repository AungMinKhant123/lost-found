import { Outlet } from 'react-router';

const AdminLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
