import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function ManageVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVolunteers();

    const interval = setInterval(() => {
      fetchVolunteers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/volunteers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVolunteers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filtering Logic
  const filteredVolunteers = volunteers.filter((v) => {
    if (filter === "assigned") return v.assignedCount > 0;
    if (filter === "unassigned") return v.assignedCount === 0;
    return true;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Volunteers</h1>

        {/* 🔹 Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("assigned")}
            className={`px-4 py-2 rounded ${
              filter === "assigned"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Assigned
          </button>

          <button
            onClick={() => setFilter("unassigned")}
            className={`px-4 py-2 rounded ${
              filter === "unassigned"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Unassigned
          </button>
        </div>

        {/* 🔹 Table */}
        <div className="bg-white rounded shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border">Name</th>
                <th className="p-3 text-left border">Email</th>
                <th className="p-3 text-center border">Tasks Assigned</th>
                <th className="p-3 text-center border">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500"
                  >
                    Loading volunteers...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredVolunteers.map((v) => (
                  <tr key={v._id}>
                    <td className="p-3 border">{v.name}</td>
                    <td className="p-3 border">{v.email}</td>
                    <td className="p-3 border text-center">
                      {v.assignedCount}
                    </td>
                    <td className="p-3 border text-center">
                      {v.assignedCount > 0 ? (
                        <span className="text-green-600 font-semibold">
                          Assigned
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Unassigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

              {!loading && filteredVolunteers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500"
                  >
                    No volunteers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}