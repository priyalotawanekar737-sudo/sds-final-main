import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 bg-white shadow-lg w-64 min-h-screen p-4 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 space-y-3">
          <Link to="/admin-dashboard" className="block px-4 py-2 hover:bg-blue-100 rounded">
            Dashboard
          </Link>

          <Link to="/admin-donations" className="block px-4 py-2 hover:bg-blue-100 rounded">
            View Donations Status
          </Link>

          <Link to="/admin-volunteers" className="block px-4 py-2 hover:bg-blue-100 rounded">
            View Volunteers
          </Link>

          <Link to="/admin-notifications" className="block px-4 py-2 hover:bg-blue-100 rounded">
            Notifications
          </Link>

          <button
            onClick={() => {
              logout();
              localStorage.clear();
              navigate("/admin-login");
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full">

        {/* Mobile Topbar */}
        <div className="md:hidden bg-white shadow p-4 flex items-center">
          <button onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="ml-4 font-semibold">Admin Panel</h1>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}