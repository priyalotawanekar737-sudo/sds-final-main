import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow min-h-screen p-4">
        <h2 className="text-2xl font-bold p-4 border-b border--200">
          Admin Panel
        </h2>

        <nav className="mt-6 space-y-2">
          <Link
            to="/admin-dashboard"
            className="block px-4 py-2 hover:bg-blue-100"
          >
            Dashboard
          </Link>

          <Link
            to="/admin-donations"
            className="block px-4 py-2 hover:bg-blue-100"
          >
            Manage Donations
          </Link>

          <Link
            to="/admin-volunteers"
            className="block px-4 py-2 hover:bg-blue-100"
          >
            Manage Volunteers
          </Link>

          <Link
             to="/admin/notifications"
              className="block px-4 py-2 hover:bg-blue-100">
               Notifications
          </Link>
         
          <button
          onClick={() => {
            logout();
            localStorage.clear();
            navigate("/admin-login");
          }}
          className="w-full text-left px-5 py-3 rounded text-red-700 hover:bg-red-50"
        >
          Logout
        </button>
          
      
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
