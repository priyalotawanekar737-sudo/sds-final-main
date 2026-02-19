import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-900 text-white">
        <h2 className="text-2xl font-bold p-4 border-b border-blue-700">
          Admin Panel
        </h2>

        <nav className="mt-6 space-y-2">
          <Link
            to="/admin-dashboard"
            className="block px-4 py-2 hover:bg-blue-700"
          >
            Dashboard
          </Link>

          <Link
            to="/admin-donations"
            className="block px-4 py-2 hover:bg-blue-700"
          >
            Manage Donations
          </Link>

          <Link
            to="/admin-volunteers"
            className="block px-4 py-2 hover:bg-blue-700"
          >
            Manage Volunteers
          </Link>

          <Link
             to="/admin/notifications"
              className="block px-4 py-2 hover:bg-blue-700">
               Notifications
          </Link>
         
          
          
      
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
