import { useState } from "react";

export default function Sidebar({ role, active, setActive, onLogout }) {
  const [open, setOpen] = useState(false);

  const menuItem = (key, label) => (
    <button
      onClick={() => {
        setActive(key);
        setOpen(false);
      }}
      className={`relative w-full text-left px-5 py-3 rounded-xl transition duration-300 
      hover:bg-blue-50 font-medium ${
        active === key ? "bg-blue-100 text-blue-900 shadow-md" : "text-gray-700"
      }`}
    >
      {active === key && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-lg" />
      )}
      {label}
    </button>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-white shadow-lg px-5 py-4">
        <h2 className="font-bold text-blue-900">DASHBOARD</h2>
        <button onClick={() => setOpen(!open)} className="text-2xl">
          {open ? "✖" : "☰"}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed md:static z-50 w-64 min-h-screen bg-white/70 backdrop-blur-xl shadow-2xl p-5 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}>

        <h2 className="text-xl font-bold text-center text-blue-900 mb-8 hidden md:block">
          DASHBOARD
        </h2>

        <nav className="space-y-3">

          {menuItem("overview", "Dashboard")}

          {role === "donor" && (
            <>
              {menuItem("upload-donation", "Upload Donation")}
              {menuItem("my-donations", "My Donations")}
            </>
          )}

          {role === "ngo" && menuItem("manage-donations", "Manage Donations")}

          <button
            onClick={onLogout}
            className="w-full text-left px-5 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition"
          >
            Logout
          </button>

        </nav>
      </aside>
    </>
  );
}