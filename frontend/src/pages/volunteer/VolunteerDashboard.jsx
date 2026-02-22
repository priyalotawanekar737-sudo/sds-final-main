import React, { useState, useEffect } from "react";
import { LogOut, Package, X } from "lucide-react";
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

  // Donations view state
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" or "donations"
  const [myImages, setMyImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [viewImage, setViewImage] = useState(null); // for image modal
  const [uploading, setUploading] = useState(false);

  // ================= IMAGE UPLOAD HANDLER =================
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setIsError(true);
      setMessage("Only image files allowed");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:5000/api/volunteer/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        setIsError(false);
        setMessage("Image uploaded successfully");
      } else {
        const data = await res.json();
        setIsError(true);
        setMessage(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsError(true);
      setMessage("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input so same file can be uploaded again
    }
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

  // ================= FETCH MY IMAGES =================
  const fetchMyImages = async () => {
    setLoadingImages(true);
    try {
      const res = await fetch("http://localhost:5000/api/volunteer/my-images", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMyImages(data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleDonationsClick = () => {
    setActiveView("donations");
    fetchMyImages();
  };

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
          <li
            className={`font-semibold cursor-pointer px-3 py-2 rounded-lg transition ${activeView === "dashboard" ? "bg-green-50 text-green-700" : "hover:bg-gray-100"}`}
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </li>
          <li className="font-semibold">
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <UploadIcon size={16} />
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
                disabled={uploading}
              />
            </label>
            {message && (
              <p className={`text-xs mt-1 ${isError ? "text-red-500" : "text-green-600"}`}>
                {message}
              </p>
            )}
          </li>
          <li
            className={`font-semibold cursor-pointer px-3 py-2 rounded-lg transition flex items-center gap-2 ${activeView === "donations" ? "bg-green-50 text-green-700" : "hover:bg-gray-100"}`}
            onClick={handleDonationsClick}
          >
            <Package size={16} />
            Donations
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

        {activeView === "dashboard" ? (
          <>
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
          </>
        ) : (
          /* ================= DONATIONS LIST VIEW ================= */
          <>
            <h2 className="text-2xl font-bold mb-6">Donations</h2>

            {loadingImages ? (
              <p className="text-gray-500">Loading images...</p>
            ) : myImages.length === 0 ? (
              <p className="text-gray-500">No images uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myImages.map((img) => (
                  <div
                    key={img._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() => setViewImage(`http://localhost:5000${img.imagePath}`)}
                  >
                    <img
                      src={`http://localhost:5000${img.imagePath}`}
                      alt="Uploaded"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ================= IMAGE MODAL ================= */}
      {viewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 max-w-lg w-full mx-4 relative">
            <button
              onClick={() => setViewImage(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-3">Proof Image</h3>
            <img
              src={viewImage}
              alt="Donation proof"
              className="w-full rounded-lg object-contain max-h-[400px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
