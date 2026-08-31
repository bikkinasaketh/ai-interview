import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Categories from "../components/Categories/Categories";
import Topics from "../pages/Topics/Topics";
import Difficulty from "../pages/Difficulty/Difficulty";
import Interview from "../pages/Interview/Interview";
import Results from "../pages/Results/Results";
import Dashboard from "../pages/Dashboard/Dashboard";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Instructions from "../pages/Instructions/Instructions";
import Profile from "../pages/Profile/Profile";
import History from "../pages/History/History";
import NotFound from "../pages/NotFound/NotFound";
import Loading from "../pages/Loading/Loading";
import Admin from "../pages/admin/Admin";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/topics" element={<Topics />} />
      <Route path="/difficulty" element={<Difficulty />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/results" element={<Results />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contact" element={<Contact />} />
  <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} /> 
<Route path="/instructions" element={<Instructions />} />
<Route path="/profile" element={<Profile />} />
<Route path="/history" element={<History />} />
<Route path="*" element={<NotFound />} />
<Route path="/loading" element={<Loading />} />
<Route
  path="/admin"
  element={<Admin />}
/>

<Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
  path="/admin/register"
  element={<AdminRegister />}
/>


    </Routes>
  );
}

export default AppRoutes;