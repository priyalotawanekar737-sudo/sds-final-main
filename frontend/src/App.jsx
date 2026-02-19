import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Existing pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// New pages for Admin/Volunteer
import LoginAdminVolunteer from './pages/LoginAdminVolunteer';
import AdminDashboard from './pages//admin/AdminDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import ManageDonations from './pages/admin/ManageDonations';
import ManageVolunteers from './pages/admin/ManageVolunteers';
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminManageNgo from "./pages/admin/AdminManageNgo";

export default function App() {
  const location = useLocation();

  // Hide navbar on these routes
  const hideNavbarRoutes = [
    '/',
    '/login',
    '/register',
    '/admin-login'
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar (hidden on login pages + home) */}
      {!hideNavbarRoutes.includes(location.pathname) && (
        <nav className="bg-white shadow p-4">
          <div className="container mx-auto flex gap-4">
            <Link to="/" className="font-bold text-blue-700 hover:text-blue-900 transition">
              Smart Donation System
            </Link>

            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>

            <Link to="/login" className="hover:text-blue-600">
              Donor/NGO Login
            </Link>

            <Link to="/admin-login" className="hover:text-blue-600">
              Admin/Volunteer Login
            </Link>

            <Link to="/register" className="hover:text-blue-600">
              Register
            </Link>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <div className="container mx-auto p-6">
        <Routes>
          {/* Existing routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* New admin & volunteer routes */}
          <Route path="/admin-login" element={<LoginAdminVolunteer />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
             <Route path="/admin-donations" element={<ManageDonations />} />
          <Route path="/admin-volunteers" element={<ManageVolunteers />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin" element={<AdminLayout />}>
  <Route path="donations" element={<ManageDonations />} />
  <Route path="volunteers" element={<ManageVolunteers />} />
  <Route path="ngos" element={<AdminManageNgo />} />
 


   </Route>
        </Routes>
      </div>
    </div>
  );
}
 