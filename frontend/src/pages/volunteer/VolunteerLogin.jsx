import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]); // All volunteers
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user, donations, and volunteers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);

        const donationRes = await api.get("/donations");
        setDonations(donationRes.data);

        // Fetch all volunteers for assignment
        const volRes = await api.get("/users?role=volunteer");
        setVolunteers(volRes.data);
      } catch (err) {
        console.error(err);
        alert("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/donations", formData);
      alert("Donation uploaded successfully!");
      setDonations([...donations, res.data]);
      setFormData({ title: "", description: "", city: "", pincode: "" });
    } catch (err) {
      alert("Failed to upload donation");
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await api.put(`/donations/${id}/accept`);
      setDonations((prev) =>
        prev.map((d) => (d._id === id ? { ...d, ...res.data.donation } : d))
      );
      alert("Donation accepted successfully!");
    } catch (err) {
      alert("Failed to accept donation");
    }
  };

  const handleAssignVolunteer = async (donationId, volunteerId) => {
    if (!volunteerId) return;

    try {
      const res = await api.put(`/donations/${donationId}/assign`, {
        volunteerId,
      });

      setDonations((prev) =>
        prev.map((d) =>
          d._id === donationId ? { ...d, ...res.data.donation } : d
        )
      );

      alert("Volunteer assigned successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to assign volunteer");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Loading your dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Please log in again.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">
        Welcome, {user.name} 👋
      </h2>
      <p className="text-gray-600 mb-6">
        Role: <span className="capitalize font-semibold">{user.role}</span>
      </p>

      {/* ---------------- DONOR DASHBOARD ---------------- */}
      {user.role === "donor" && (
        <>
          <div className="bg-white shadow-md rounded-xl p-6 mb-10">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">
              Upload New Donation
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Donation Title"
                required
                className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
                className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="border p-2 rounded-md md:col-span-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition md:col-span-2"
              >
                Submit Donation
              </button>
            </form>
          </div>

          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Your Donations
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations
              .filter((d) => d.donor === user._id)
              .map((d) => (
                <div
                  key={d._id}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-semibold mb-2">{d.title}</h4>
                  <p className="text-gray-600 mb-2">{d.description}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    {d.city} - {d.pincode}
                  </p>
                  <p
                    className={`font-semibold ${
                      d.status === "accepted"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {d.status}
                  </p>
                  {d.volunteerId && (
                    <p className="mt-1 text-purple-600 font-medium">
                      Volunteer: {d.volunteerId.name} ({d.volunteerId.email})
                    </p>
                  )}
                </div>
              ))}
          </div>
        </>
      )}

      {/* ---------------- NGO DASHBOARD ---------------- */}
      {user.role === "ngo" && (
        <>
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Available Donations
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations
              .filter((d) => d.status === "pending")
              .map((d) => (
                <div
                  key={d._id}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-semibold mb-2">{d.title}</h4>
                  <p className="text-gray-600 mb-1">{d.description}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    {d.city} - {d.pincode}
                  </p>
                  <button
                    onClick={() => handleAccept(d._id)}
                    className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                </div>
              ))}
          </div>

          <h3 className="text-xl font-semibold text-blue-700 mt-10 mb-3">
            Accepted Donations
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations
              .filter((d) => d.status === "accepted" || d.status === "assigned")
              .map((d) => (
                <div
                  key={d._id}
                  className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-semibold mb-2">{d.title}</h4>
                  <p className="text-gray-600">{d.description}</p>
                  <p className="text-sm text-gray-500">
                    {d.city} - {d.pincode}
                  </p>
                  <p className="mt-2 text-green-600 font-semibold">
                    Accepted ✅
                  </p>

                  {d.volunteerId && (
                    <p className="mt-1 text-purple-600 font-medium">
                      Volunteer: {d.volunteerId.name} ({d.volunteerId.email})
                    </p>
                  )}

                  <select
                    onChange={(e) =>
                      handleAssignVolunteer(d._id, e.target.value)
                    }
                    className="border mt-2 p-1 rounded w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Assign Volunteer
                    </option>
                    {volunteers.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.email})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
