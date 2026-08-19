import { Routes, Route } from 'react-router';
import UserLayout from './layouts/user/UserLayout';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
const App = () => {
  return (
    <>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='profile/:id' element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
