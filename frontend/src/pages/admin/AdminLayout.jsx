import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#8FA9C7]">

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-40 bg-[#E6EEF7] shadow-x4 w-64 min-h-screen p-6 transform 
        ${isOpen ? "translate-x-2" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex justify-between items-center border-b border-blue-200 pb-4">
          <h2 className="text-xl font-bold text-blue-800 tracking-wide">
            ADMIN PANEL
          </h2>

          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 space-y-3">
          <Link
            to="/admin-dashboard"
            className="block px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-200 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin-donations"
            className="block px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-200 transition"
          >
            Donations
          </Link>

          <Link
            to="/admin-volunteers"
            className="block px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-200 transition"
          >
            Volunteers
          </Link>

          <Link
            to="/admin-notifications"
            className="block px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-200 transition"
          >
            Notifications
          </Link>

          <button
            onClick={() => {
              logout();
              localStorage.clear();
              navigate("/admin-login");
            }}
            className="w-full text-left px-4 py-2 mt-6 text-red-600 hover:bg-red-200 rounded-lg transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 w-full">

        {/* MOBILE TOPBAR */}
        <div className="md:hidden bg-[#E6EEF7] shadow-md p-4 flex items-center">
          <button onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="ml-4 font-semibold text-blue-900">
            Admin Panel
          </h1>
        </div>

        <main className="p-6 md:p-10 min-h-screen bg-[#88b6ea]">
          {children}
        </main>
      </div>
    </div>
  );
}