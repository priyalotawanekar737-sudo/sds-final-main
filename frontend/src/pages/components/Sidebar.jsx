export default function Sidebar({ role, active, setActive, onLogout }) {
  return (
    <aside className="w-64 bg-white shadow min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-center">
        Smart Donation
      </h2>

      <nav className="space-y-2">
        {/* COMMON */}
        <button
          onClick={() => setActive("overview")}
          className={`w-full text-left px-4 py-2 rounded ${
            active === "overview" ? "bg-blue-100" : ""
          }`}
        >
          Dashboard
        </button>

        
        {/* DONOR */}
        {role === "donor" && (
          <>
            <button
              onClick={() => setActive("upload-donation")}
              className={`w-full text-left px-4 py-2 rounded ${
                active === "upload-donation" ? "bg-blue-100" : ""
              }`}
            >
              Upload Donation
            </button>

            <button
              onClick={() => setActive("my-donations")}
              className={`w-full text-left px-4 py-2 rounded ${
                active === "my-donations" ? "bg-blue-100" : ""
              }`}
            >
              My Donations
            </button>
          </>
        )}

        {/* NGO */}
        {role === "ngo" && (
          <button
            onClick={() => setActive("manage-donations")}
            className={`w-full text-left px-4 py-2 rounded ${
              active === "manage-donations" ? "bg-blue-100" : ""
            }`}
          >
            Manage Donations
          </button>
        )}

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
