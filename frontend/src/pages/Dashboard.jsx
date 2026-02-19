import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import DonationTracker from "./components/DonationTracker";
import NgoDonations from "./components/NgoDonations";
import DonorUpload from "./components/DonorUpload";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ================= LOAD USER + DONATIONS =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);

        const donationRes = await api.get("/donations");
        setDonations(donationRes.data);
      } catch (err) {
        alert("Session expired");
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ================= NGO S =================
  const acceptDonation = async (id) => {
    const res = await api.put(`/donations/${id}/accept`);
    setDonations(prev =>
      prev.map(d => (d._id === id ? res.data.donation : d))
    );
  };

  const assignVolunteer = async (id, volunteerId) => {
    if (!volunteerId) return;
    const res = await api.put(`/donations/${id}/assign`, { volunteerId });
    setDonations(prev =>
      prev.map(d => (d._id === id ? res.data.donation : d))
    );
  };

  const markCompleted = (id) => {
    setDonations(prev =>
      prev.map(d =>
        d._id === id ? { ...d, status: "completed" } : d
      )
    );
  };

  if (loading) return <p className="p-10">Loading dashboard...</p>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        role={user.role}
        active={active}
        setActive={setActive}
        onLogout={logout}
      />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">
          Welcome, {user.name} 👋
        </h2>

        {/* ================= OVERVIEW ================= */}
        {active === "overview" && (
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Total Donations" value={donations.length} />
            <StatCard
              title="Pending"
              value={donations.filter(d => d.status === "pending").length}
            />
            <StatCard
              title="Completed"
              value={donations.filter(d => d.status === "completed").length}
            />
          </div>
        )}

        {/* ================= DONOR ================= */}
        {user.role === "donor" && active === "upload-donation" && (
          <DonorUpload
            onSuccess={(newDonation) =>
              setDonations(prev => [newDonation, ...prev])
            }
          />
        )}

        {user.role === "donor" && active === "my-donations" && (
          <div className="grid md:grid-cols-3 gap-6">
            {donations
              .filter(d => d.donor?._id === user._id)
              .map(d => (
                <div key={d._id} className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold">{d.title}</h3>
                  <p className="text-sm text-gray-600">
                    📍 {d.state}, {d.city}
                  </p>

                  <p className="mt-1">
                    Status:
                    <span
                      className={`ml-2 font-semibold ${
                        d.status === "assigned" || d.status === "completed"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {d.status}
                    </span>
                  </p>

                  {/* 👇 THIS IS WHAT DONOR SEES */}
                  <DonationTracker status={d.status} />
                </div>
              ))}
          </div>
        )}

        {/* ================= NGO ================= */}
        {user.role === "ngo" && active === "manage-donations" && (
          <NgoDonations
            donations={donations}
            acceptDonation={acceptDonation}
            assignVolunteer={assignVolunteer}
            setDonations={setDonations}
            markCompleted={markCompleted}
          />
        )}
      </main>
    </div>
  );
}
