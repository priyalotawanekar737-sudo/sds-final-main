import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchDonations();
  }, []);

  // 🔹 Fetch Donations
  const fetchDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Filter Logic
  const getFilteredDonations = () => {
    switch (filter) {
      case "assigned":
        return donations.filter(
          (d) => d.status?.toLowerCase() === "assigned"
        );

      case "pending":
        return donations.filter(
          (d) => d.status?.toLowerCase() === "pending"
        );

      case "completed":
        return donations.filter(
          (d) => d.status?.toLowerCase() === "completed"
        );

      case "accepted":
        return donations.filter(
          (d) => d.status?.toLowerCase() === "accepted"
        );

      default:
        return donations;
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Donations Status</h1>

      {/* 🔹 Filter Buttons */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["all", "accepted", "assigned", "pending", "completed"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded capitalize ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* 🔹 Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Title</th>
            <th className="p-2">City</th>
            <th className="p-2">Status</th>
            <th className="p-2">Volunteer</th>
          </tr>
        </thead>

        <tbody>
          {getFilteredDonations().map((d) => (
            <tr key={d._id} className="border-t bg-white">
              <td className="p-2">{d.title}</td>
              <td className="p-2">{d.city}</td>
              <td className="p-2 capitalize">
                <span
                  className={`font-semibold ${
                    d.status === "completed"
                      ? "text-green-600"
                      : d.status === "assigned"
                      ? "text-blue-600"
                      : d.status === "pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {d.status}
                </span>
              </td>
              <td className="p-3">
                {d.volunteerId?.name || "Not Assigned"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}