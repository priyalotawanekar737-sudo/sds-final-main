import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// Main pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Initiatives from "./pages/Initiatives";

// Admin / Volunteer
import LoginAdminVolunteer from "./pages/LoginAdminVolunteer";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDonations from "./pages/admin/ManageDonations";
import ManageVolunteers from "./pages/admin/ManageVolunteers";
import AdminNotifications from "./pages/admin/AdminNotifications";

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const hideNavbarRoutes = ["/", "/login", "/register", "/admin-login"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      {!hideNavbarRoutes.includes(location.pathname) && (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-700">
              Smart Donation System
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6">
              <Link to="/about">About</Link>
              <Link to="/initiatives">Initiatives</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/login">Donor/NGO Login</Link>
              <Link to="/admin-login">Admin/Volunteer Login</Link>
              <Link to="/register">Register</Link>
            </div>

            {/* Mobile Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
              <Link to="/about">About</Link>
              <Link to="/initiatives">Initiatives</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/login">Donor/NGO Login</Link>
              <Link to="/admin-login">Admin/Volunteer Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
      )}

      {/* PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-login" element={<LoginAdminVolunteer />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-donations" element={<ManageDonations />} />
          <Route path="/admin-volunteers" element={<ManageVolunteers />} />
          <Route path="/admin-notifications" element={<AdminNotifications />} />
        </Routes>
      </div>
    </div>
  );
}