import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function ManageVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
  fetchVolunteers(); // first load

  const interval = setInterval(() => {
    fetchVolunteers(); // refresh every 5 seconds
  }, 5000); // 5000ms = 5 seconds

  return () => clearInterval(interval); // cleanup
}, []);


  const fetchVolunteers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/volunteers",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setVolunteers(res.data);
  };

  const filteredVolunteers = volunteers.filter((v) => {
    if (filter === "assigned") return v.assignedCount > 0;
    if (filter === "unassigned") return v.assignedCount === 0;
    return true;
  });

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Volunteers</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          All Volunteers
        </button>

        <button
          onClick={() => setFilter("assigned")}
          className={`px-4 py-2 rounded ${
            filter === "assigned" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Assigned
        </button>

        <button
          onClick={() => setFilter("unassigned")}
          className={`px-4 py-2 rounded ${
            filter === "unassigned" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Unassigned
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow">
  <table className="w-full border-collapse">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 text-left border">Name</th>
        <th className="p-3 text-left border">Email</th>
        <th className="p-3 text-center border">Tasks Assigned</th>
      </tr>
    </thead>

    <tbody>
      {/* Manual Volunteers */}
      <tr>
        <td className="p-3 border">Volunteer 1</td>
        <td className="p-3 border">vol1@donation.com</td>
        <td className="p-3 border text-center">2</td>
      </tr>

      <tr>
        <td className="p-3 border">Volunteer 2</td>
        <td className="p-3 border">vol2@donation.com</td>
        <td className="p-3 border text-center">0</td>
      </tr>

      <tr>
        <td className="p-3 border">Volunteer 3</td>
        <td className="p-3 border">vol3@donation.com</td>
        <td className="p-3 border text-center">0</td>
      </tr>

      <tr>
        <td className="p-3 border">Volunteer 4</td>
        <td className="p-3 border">vol4@donation.com</td>
        <td className="p-3 border text-center">0</td>
      </tr>

      <tr>
        <td className="p-3 border">Volunteer 5</td>
        <td className="p-3 border">vol5@donation.com</td>
        <td className="p-3 border text-center">0</td>
      </tr>

      {/* Dynamic Volunteers from Backend */}
      {filteredVolunteers.map((v) => (
        <tr key={v._id}>
          <td className="p-3 border">{v.name}</td>
          <td className="p-3 border">{v.email}</td>
          <td className="p-3 border text-center">
            {v.assignedCount}
          </td>
        </tr>
      ))}

      {filteredVolunteers.length === 0 && (
        <tr>
          <td colSpan="3" className="p-4 text-center text-gray-500">
            No volunteers found
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
