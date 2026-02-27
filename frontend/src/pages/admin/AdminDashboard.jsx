import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDonors: 0,
    totalNGOs: 0,
    totalVolunteers: 0,
    totalDonations: 0,
  });

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= ADMIN PROTECTION =================
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!user && !savedUser) {
      navigate("/admin-login");
      return;
    }

    if (
      (user && user.role !== "admin") ||
      (savedUser && savedUser.role !== "admin")
    ) {
      navigate("/admin-login");
    }
  }, [user, navigate]);

  // ================= LOAD DATA =================
  useEffect(() => {
    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [statsRes, donationsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("http://localhost:5000/api/admin/donations", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setStats(statsRes.data);
        setDonations(donationsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const markCompleted = async (id) => {
    try {
      const authToken = token || localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/donations/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setDonations((prev) =>
        prev.map((d) => (d._id === id ? res.data.donation : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-xl shadow-md p-6">
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
          Welcome,{" "}
          {user?.name || JSON.parse(localStorage.getItem("user"))?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Admin Control Panel
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Donors", value: stats.totalDonors },
          { label: "NGOs", value: stats.totalNGOs },
          { label: "Volunteers", value: stats.totalVolunteers },
          { label: "Total Donations", value: stats.totalDonations },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>
            <h2 className="text-3xl font-bold text-blue-900 mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* DONATIONS TABLE */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-6">
          Manage Donations
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="border-b bg-blue-50 text-blue-900">
                <th className="text-left py-3 px-3">Donor</th>
                <th className="text-left py-3 px-3">City</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-left py-3 px-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No donations found
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr
                    key={d._id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="py-3 px-3">
                      {d.donor?.name || "N/A"}
                    </td>
                    <td className="px-3">{d.city}</td>
                    <td className="capitalize px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          d.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : d.status === "assigned"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-3">
                      {d.status === "assigned" && (
                        <button
                          onClick={() => markCompleted(d._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm transition"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}