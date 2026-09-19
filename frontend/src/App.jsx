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
import ChangePassword from "./pages/user/ChangePassword";
import PasswordUpdated from "./pages/user/PasswordUpdated";
import Notification from "./pages/user/Notification";
import LogOut from "./pages/user/LogOut";
import DeleteAccount from "./pages/user/DeleteAccount";
import HowItWorks from "./pages/user/HowItWorks";
import PostClaims from "./pages/user/PostClaims";
import AcceptedClaimView from "./pages/user/AcceptedClaimView";
import ItemList from "./pages/user/ItemList";
import AboutUs from "./pages/user/AboutUs";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="items/:id" element={<ItemDetails />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="item-list" element={<ItemList />} />

          {/* Account section: sidebar + nested pages */}
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountProfile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="password-updated" element={<PasswordUpdated />} />
            <Route path="posts" element={<MyPosts />} />
            <Route path="claims" element={<MyClaims />} />
            <Route path="claims/:id" element={<ClaimDetails />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="delete-account" element={<DeleteAccount />} />
            <Route path="logout" element={<LogOut />} />
            <Route path="*" element={<NotFound />} />
            <Route path="posts/:id" element={<PostClaims />} />
            <Route
              path="posts/:itemId/claims/:claimId"
              element={<AcceptedClaimView />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
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
