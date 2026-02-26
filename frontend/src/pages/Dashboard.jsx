import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import DonationTracker from "./components/DonationTracker";
import NgoDonations from "./components/NgoDonations";
import DonorUpload from "./components/DonorUpload";
import Certificate from "./components/Certificate";

export default function Dashboard() {

  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [certificates, setCertificates] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= API DATA LOAD ================= */

  const loadData = async () => {
    try {

      const userRes = await api.get("/auth/me");
      setUser(userRes.data);

      const donationRes = await api.get("/donations");
      setDonations(donationRes.data);

    } catch {
      alert("Session expired");
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* ================= DONATION ACTION APIs ================= */

  const deleteDonation = async (id) => {
    try {

      await api.delete(`/donations/${id}`);

      setDonations(prev =>
        prev.filter(d => d._id !== id)
      );

    } catch {
      alert("Failed to delete donation");
    }
  };

  const acceptDonation = async (id) => {
    try {

      const res = await api.put(`/donations/${id}/accept`);

      setDonations(prev =>
        prev.map(d =>
          d._id === id ? res.data.donation : d
        )
      );

    } catch {
      alert("Accept donation failed");
    }
  };

  const assignVolunteer = async (id, volunteerId) => {
    try {

      if (!volunteerId) return;

      const res = await api.put(`/donations/${id}/assign`, {
        volunteerId
      });

      setDonations(prev =>
        prev.map(d =>
          d._id === id ? res.data.donation : d
        )
      );

    } catch {
      alert("Volunteer assignment failed");
    }
  };

  const markCompleted = async (id) => {
    try {

      const res = await api.put(`/donations/${id}/complete`);

      setDonations(prev =>
        prev.map(d =>
          d._id === id ? res.data.donation : d
        )
      );

    } catch {
      alert("Completion update failed");
    }
  };

  /* ================= LOADING CHECK ================= */

  if (loading) return <p className="p-10 text-blue-900">Loading dashboard...</p>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#afccf1] relative">

      <Sidebar
        role={user.role}
        active={active}
        setActive={setActive}
        onLogout={logout}
      />

      <main className="flex-1 p-6 md:p-10 space-y-8">

        {/* HEADER */}
        {active === "overview" && (
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">

            <h2 className="text-2xl font-bold text-slate-800">
              Welcome, {user.name} 👋
            </h2>

            <p className="text-sm text-gray-500 capitalize mt-1">
              {user.role} dashboard
            </p>

          </div>
        )}

        {/* DASHBOARD STATS */}
        {active === "overview" && (
          <div className="grid md:grid-cols-3 gap-6">

            <StatCard
              title="Total Donations"
              value={donations.length}
            />

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

        {/* NGO WORK SECTION */}
        {user.role === "ngo" && active === "overview" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Our Work
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {[
                {
                  img: "https://images.unsplash.com/photo-1542627088-6603b66e5c54",
                  text: "Small Acts. Big Impact"
                },
                {
                  img: "https://media.istockphoto.com/id/163689960/photo/paper-men-joining-together-as-team-union-family-or-network.jpg?s=1024x1024&w=is&k=20&c=c9qYl7pIkGHIgR8yMvbZtX6mvMEvuHOgAnKG07y174g=",
                  text: "Digital Donation Empowerment"
                },
                {
                  img: "https://plus.unsplash.com/premium_photo-1683140538884-07fb31428ca6",
                  text: "From Your Kindness to Someone’s Hope"
                }
              ].map((work, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100"
                >
                  <img
                    src={work.img}
                    alt="work"
                    className="w-full h-48 object-cover"
                  />

                  <p className="p-4 text-sm text-center text-gray-700 font-medium">
                    {work.text}
                  </p>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* DONOR UPLOAD */}
        {user.role === "donor" && active === "upload-donation" && (
          <DonorUpload
            onSuccess={(newDonation) =>
              setDonations(prev => [newDonation, ...prev])
            }
          />
        )}

        {/* DONOR MY DONATIONS */}
        {user.role === "donor" && active === "my-donations" && (

          <div className="grid md:grid-cols-3 gap-6">

            {donations
              .filter(d => d.donor?._id === user._id)
              .map(d => (

                <div key={d._id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">

                  <h3 className="font-semibold text-slate-800">{d.title}</h3>

                  <p className="text-sm text-gray-500">
                    📍 {d.state}, {d.city}
                  </p>

                  <p className="mt-2 text-sm">
                    Status:
                    <span className={`ml-2 font-semibold ${
                      d.status === "assigned" || d.status === "completed"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}>
                      {d.status}
                    </span>
                  </p>

                  <DonationTracker status={d.status} />

                  {d.status !== "completed" && (
                    <button
                      onClick={() => deleteDonation(d._id)}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}

                  {d.status === "completed" && (
                    <button
                      onClick={() => {

                        setSelectedDonation(d);

                        setCertificates(prev => {
                          if (prev.find(x => x._id === d._id)) return prev;
                          return [...prev, d];
                        });

                      }}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      GET CERTIFICATE
                    </button>
                  )}

                </div>
              ))}
          </div>
        )}

        {/* CERTIFICATE LIST */}
        {user.role === "donor" && active === "overview" && certificates.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              My Certificates 📜⭐
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {certificates.map(cert => (

                <div key={cert._id} className="bg-teal-50 rounded-xl shadow-sm hover:shadow-md transition p-4 text-center">

                  <h3 className="font-semibold text-slate-800">
                    {cert.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Donation Completed ✔
                  </p>

                  <button
                    onClick={() => setSelectedDonation(cert)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Certificate
                  </button>

                </div>

              ))}

            </div>
          </div>
        )}

        {/* NGO MANAGE DONATIONS */}
        {user.role === "ngo" && active === "manage-donations" && (
          <NgoDonations
            donations={donations}
            acceptDonation={acceptDonation}
            assignVolunteer={assignVolunteer}
            setDonations={setDonations}
            markCompleted={markCompleted}
          />
        )}

        {selectedDonation && (
          <Certificate
            donorName={user.name}
            donationTitle={selectedDonation.title}
            onClose={() => setSelectedDonation(null)}
          />
        )}

      </main>
    </div>
  );
}