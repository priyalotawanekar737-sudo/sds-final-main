import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchDonations();
    fetchVolunteers();
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

  // 🔹 Fetch Volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/volunteers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setVolunteers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Assign Donation
  const assignDonation = async (donationId) => {
    const volunteerId = selectedVolunteer[donationId];
    if (!volunteerId) return alert("Select a volunteer");

    try {
      await axios.put(
        `http://localhost:5000/api/donations/${donationId}/assign`,
        { volunteerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchDonations();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Filter Logic
  const getFilteredDonations = () => {
  switch (filter) {
    case "assigned":
      return donations.filter(
        (d) =>
          d.volunteerId &&
          d.status?.toLowerCase() === "assigned"
      );

    case "unassigned":
      return donations.filter(
        (d) =>
          !d.volunteerId &&
          d.status?.toLowerCase() !== "completed"
      );

    case "pending":
      return donations.filter(
        (d) => d.status?.toLowerCase() === "pending"
      );

    case "completed":
      return donations.filter(
        (d) => d.status?.toLowerCase() === "completed"
      );

    default:
      return donations;
  }
};

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Donations</h1>

      {/* 🔹 Filter Buttons */}
      <div className="flex gap-3 mb-4 flex-wrap">
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
            filter === "assigned" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Assigned
        </button>

        <button
          onClick={() => setFilter("unassigned")}
          className={`px-4 py-2 rounded ${
            filter === "unassigned" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Unassigned
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${
            filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded ${
            filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Completed
        </button>
      </div>

      {/* 🔹 Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Title</th>
            <th className="p-2">City</th>
            <th className="p-2">Status</th>
            <th className="p-2">Volunteer</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {getFilteredDonations().map((d) => (
            <tr key={d._id} className="border-t">
              <td className="p-2">{d.title}</td>
              <td className="p-2">{d.city}</td>
              <td className="p-2 capitalize">{d.status}</td>
              <td className="p-2">
                {d.volunteerId?.name || "Not Assigned"}
              </td>
              <td className="p-2">
                {d.status === "accepted" && (
                  <div className="flex gap-2">
                    <select
                      className="border p-1 rounded"
                      onChange={(e) =>
                        setSelectedVolunteer({
                          ...selectedVolunteer,
                          [d._id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      {volunteers.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.name}
                        </option>
                      ))}
                    </select>

                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => assignDonation(d._id)}
                    >
                      Assign
                    </button>
                  </div>
                )}

                {d.status === "assigned" && (
                  <span className="text-blue-600 font-semibold">
                    Assigned
                  </span>
                )}

                {d.status === "completed" && (
                  <span className="text-green-600 font-semibold">
                    Completed
                  </span>
                )}

                {d.status === "pending" && (
                  <span className="text-yellow-600 font-semibold">
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}