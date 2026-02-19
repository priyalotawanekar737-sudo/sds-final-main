import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDonors: 0,
    totalNGOs: 0,
    totalVolunteers: 0,
    totalDonations: 0
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

    if ((user && user.role !== "admin") ||
        (savedUser && savedUser.role !== "admin")) {
      navigate("/admin-login");
    }
  }, [user, navigate]);

  // ================= LOAD DASHBOARD DATA =================
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
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          axios.get("http://localhost:5000/api/admin/donations", {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        ]);

        setStats(statsRes.data);
        setDonations(donationsRes.data);
      } catch (err) {
        console.error(
          "Admin dashboard error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Auto refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);

  }, [token]);

  // ================= ADMIN ACTIONS =================

  const acceptDonation = async (id) => {
    try {
      const authToken = token || localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/donations/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setDonations(prev =>
        prev.map(d => (d._id === id ? res.data.donation : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markCompleted = async (id) => {
    try {
      const authToken = token || localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/donations/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setDonations(prev =>
        prev.map(d => (d._id === id ? res.data.donation : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <AdminLayout>
        <p className="p-10">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || JSON.parse(localStorage.getItem("user"))?.name}
          </h1>
          <p className="text-gray-600">Admin Control Panel</p>
        </div>

        <button
          onClick={() => {
            logout();
            localStorage.clear();
            navigate("/admin-login");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Donors</p>
          <h2 className="text-3xl font-bold">{stats.totalDonors}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">NGOs</p>
          <h2 className="text-3xl font-bold">{stats.totalNGOs}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Volunteers</p>
          <h2 className="text-3xl font-bold">{stats.totalVolunteers}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Donations</p>
          <h2 className="text-3xl font-bold">{stats.totalDonations}</h2>
        </div>
      </div>

      {/* ================= DONATIONS TABLE ================= */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Donations</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="text-left py-2">Donor</th>
              <th className="text-left py-2">City</th>
              <th className="text-left py-2">Status</th>
              
            </tr>
          </thead>

          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No donations found
                </td>
              </tr>
            ) : (
              donations.map(d => (
                <tr key={d._id} className="border-t">
                  <td className="py-2">{d.donor?.name || "N/A"}</td>
                  <td>{d.city}</td>
                  <td className="capitalize">{d.status}</td>
                  <td>
                  

                    {d.status === "assigned" && (
                      <button
                        onClick={() => markCompleted(d._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
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
    </AdminLayout>
  );
}
