import { Routes, Route } from "react-router";
import UserLayout from "./layouts/user/UserLayout";
import Home from "./pages/user/Home";
import AdminLayout from "./layouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/user/NotFound";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import AccountLayout from "./layouts/user/AccountLayout";
import AccountProfile from "./pages/user/AccountProfile";
import EditProfile from "./pages/user/EditProfile";
import MyPosts from "./pages/user/MyPosts";
import MyClaims from "./pages/user/MyClaims";
import AccountSettings from "./pages/user/AccountSettings";
import ItemDetails from "./pages/ItemDetails";
import ClaimDetails from "./pages/ClaimDetails";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="items/:id" element={<ItemDetails />} />

          {/* Account section: sidebar + nested pages */}
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountProfile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="posts" element={<MyPosts />} />
            <Route path="claims" element={<MyClaims />} />
            <Route path="claims/:id" element={<ClaimDetails />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </>
  );
};

export default App;
