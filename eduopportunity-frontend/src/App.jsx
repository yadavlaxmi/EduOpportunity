import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/student/Dashboard";
import ProfileSetup from "./pages/student/ProfileSetup";
import StudentProfile from "./pages/student/Profile";
import Scholarships from "./pages/student/Scholarships";
import Olympiads from "./pages/student/Olympiads";
import Saved from "./pages/student/Saved";
import Applied from "./pages/student/Applied";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/scholarships" element={<div>Scholarships Page (Coming Soon)</div>} />
          <Route path="/olympiads" element={<div>Olympiads Page (Coming Soon)</div>} />
          <Route path="/about" element={<div>About Page (Coming Soon)</div>} />
          
          {/* Profile Setup Page (Navbar/Footer but no Sidebar) */}
          <Route path="/student/profile-setup" element={<ProfileSetup />} />
        </Route>
        
        {/* Auth routes without Navbar/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes with Sidebar/Navbar */}
        <Route path="/student" element={<DashboardLayout role="student" />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="olympiads" element={<Olympiads />} />
          <Route path="saved" element={<Saved />} />
          <Route path="applied" element={<Applied />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="/organization" element={<DashboardLayout role="organization" />}>
          <Route path="dashboard" element={<div>Org Dashboard (Coming Soon)</div>} />
          <Route path="scholarships" element={<div>Org Scholarships (Coming Soon)</div>} />
          <Route path="olympiads" element={<div>Org Olympiads (Coming Soon)</div>} />
          <Route path="profile" element={<div>Profile (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;