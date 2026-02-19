import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

export default function AdminManageNgo() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Admin protection
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
    }
  }, [user, navigate]);

  // Load NGOs
  useEffect(() => {
    if (token) fetchNGOs();
  }, [token]);

  const fetchNGOs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/ngos",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNgos(res.data);
    } catch (err) {
      console.error("Error loading NGOs", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ngoId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/ngos/${ngoId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchNGOs(); // refresh list
    } catch (err) {
      console.error("Status update failed", err.response?.data || err.message);
    }
  };

  if (!user) return null;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Manage NGOs</h1>

        {loading ? (
          <p>Loading NGOs...</p>
        ) : ngos.length === 0 ? (
          <p className="text-gray-500">No NGOs found</p>
        ) : (
          <table className="w-full bg-white shadow rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">NGO Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">City</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {ngos.map((ngo) => (
                <tr key={ngo._id} className="border-t">
                  <td className="p-3">{ngo.name}</td>
                  <td className="p-3">{ngo.email}</td>
                  <td className="p-3">{ngo.city || "N/A"}</td>
                  <td className="p-3 capitalize">{ngo.status}</td>
                  <td className="p-3 space-x-2">
                    {ngo.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(ngo._id, "approved")}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Approve
                      </button>
                    )}
                    {ngo.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(ngo._id, "rejected")}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
