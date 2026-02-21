import React, { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UploadIcon from "../../icons/UploadIcon";

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [counts, setCounts] = useState({ assigned: 0, ongoing: 0, completed: 0 });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  // const [adminStatDataState, setAdminStatDataState] = useState({ totalDonors: 0 });

  const statusFlow = ["assigned", "on_the_way", "collected", "delivered"];
  const steps = ["Pickup Donation", "Donation Picked Up", "Donation Delivered", "Donation Completed"];

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  // ================= IMAGE HANDLERS =================


  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setIsError(true);
      setMessage("Image upload failed");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setIsError(true);
      setMessage("Only image files allowed");
      return;
    }

    setIsError(false);
    setMessage("Image has been successfully uploaded");
  };

  // ================= ROUTE PROTECT =================
  useEffect(() => {
    if (!user || user.role !== "volunteer") navigate("/admin-login");
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  // ================= FETCH DATA =================
  const fetchDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/volunteer/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();
      setDonations(data.donations);
      setCounts(data.summary);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ================= STATUS UPDATE =================
  const handleStatusClick = async (donation) => {
    const currentIndex = statusFlow.indexOf(donation.status);
    if (currentIndex < statusFlow.length - 1) {
      const newStatus = statusFlow[currentIndex + 1];

      const updatedDonations = donations.map((d) =>
        d._id === donation._id ? { ...d, status: newStatus } : d
      );
      setDonations(updatedDonations);
      setCounts({
        assigned: updatedDonations.filter(d => d.status === "accepted").length,
        ongoing: updatedDonations.filter(d => d.status === "pending").length,
        completed: updatedDonations.filter(d => d.status === "delivered").length,
      });

      try {
        await fetch(`http://localhost:5000/api/volunteer/donation/${donation._id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (error) {
        console.error("Error updating donation status:", error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-8">Volunteer Panel</h2>
        <ul className="space-y-4 text-gray-700">
          <li className="font-semibold">Dashboard</li>
          <li className="font-semibold">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-3 cursor-pointer">
              <UploadIcon size={16} />
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </label>
            {message && (
              <p className={`text-xs mt-1 ${isError ? "text-red-500" : "text-green-600"}`}>
                {message}
              </p>
            )}
          </li>

        </ul>
        <button onClick={handleLogout} className="mt-10 flex items-center gap-2 text-red-500">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-1">Welcome, {user.name} 🙌</h1>
        <p className="text-gray-600 mb-8">Email: {user.email}</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
            <h4>Total Donors</h4>
            <p className="text-3xl mt-2">{counts.assigned}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-xl shadow">
            <h4>Ongoing Donations</h4>
            <p className="text-3xl mt-2">{counts.ongoing}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-xl shadow">
            <h4>Completed Donations</h4>
            <p className="text-3xl mt-2">{counts.completed}</p>
          </div>
        </div>

        {/* Donations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donations.length === 0 && <p className="text-gray-500">No donations assigned yet.</p>}

          {donations.map((donation) => (
            <div key={donation._id} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Donor: {donation.donorName}</h3>
              <p className="text-sm text-gray-500 mb-4">Location: {donation.location}</p>

              <div className="flex gap-2 mb-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${statusFlow.indexOf(donation.status) >= index
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {steps.map((label, index) => (
                  <button
                    key={index}
                    onClick={() => handleStatusClick(donation)}
                    // disabled={statusFlow.indexOf(donation.status) !== index}
                    className={`py-2 px-3 rounded-lg transition ${statusFlow.indexOf(donation.status) > index
                      ? "bg-green-100 text-green-700 font-medium"
                      : "bg-gray-100 text-gray-500"
                      } ${statusFlow.indexOf(donation.status) === index
                        ? "ring-2 ring-green-400"
                        : ""
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
