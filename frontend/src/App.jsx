import { Routes, Route } from "react-router";
import UserLayout from "./layouts/user/UserLayout";
import Home from "./pages/user/Home";
import Profile from "./pages/user/Profile";
import AdminLayout from "./layouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
