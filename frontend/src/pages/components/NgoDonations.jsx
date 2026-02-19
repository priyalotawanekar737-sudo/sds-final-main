import { useState, useEffect } from "react";
import api from "../../api"; // Make sure this points to your axios instance

export default function NgoDonations({
  donations,
  setDonations,
  acceptDonation,
  assignVolunteer,
  token,
}) {
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);

  // Fetch volunteers from backend
  useEffect(() => {
    if (token) {
      const fetchVolunteers = async () => {
        try {
          setLoadingVolunteers(true);
          const res = await api.get("/users", {
            headers: { Authorization: `Bearer ${token}` },
            params: { role: "volunteer" },
          });
          setVolunteers(res.data);
        } catch (err) {
          console.error("Error fetching volunteers:", err);
        } finally {
          setLoadingVolunteers(false);
        }
      };
      fetchVolunteers();
    }
  }, [token]);

  // Unique states & cities for dropdown
  const states = [...new Set(donations.map((d) => d.state).filter(Boolean))];
  const cities = [
    ...new Set(
      donations
        .filter((d) => !stateFilter || d.state === stateFilter)
        .map((d) => d.city)
        .filter(Boolean)
    ),
  ];

  // Apply filters
  const filteredDonations = donations.filter(
    (d) =>
      (!stateFilter || d.state === stateFilter) &&
      (!cityFilter || d.city === cityFilter)
  );

  const markCompleted = (id) => {
    setDonations((prev) =>
      prev.map((d) => (d._id === id ? { ...d, status: "completed" } : d))
    );
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Manage Donations</h3>

      {/* ================= FILTERS ================= */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setCityFilter("");
          }}
        >
          <option value="">Filter by State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">Filter by City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* ================= DONATIONS ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredDonations.map((d) => (
          <div key={d._id} className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold text-lg">{d.title}</h4>

            <p className="text-sm text-gray-600">
              📍 {d.state}, {d.city}
            </p>

            <p className="mt-2">
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

            {/* ================= ACTIONS ================= */}
            {d.status === "pending" && (
              <button
                onClick={() => acceptDonation(d._id)}
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded"
              >
                Accept Donation
              </button>
            )}

            {d.status === "accepted" && (
              <div className="mt-3">
                <select
                  className="border p-1"
                  onChange={(e) => assignVolunteer(d._id, e.target.value)}
                  defaultValue=""
                  disabled={loadingVolunteers || volunteers.length === 0}
                >
                  <option value="" disabled>
                    {loadingVolunteers
                      ? "Loading volunteers..."
                      : volunteers.length === 0
                      ? "No volunteers available"
                      : "Assign Volunteer"}
                  </option>
                  {volunteers.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {d.status === "assigned" && (
              <button
                onClick={() => markCompleted(d._id)}
                className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
              >
                Mark as Completed
              </button>
            )}

            {d.status === "completed" && (
              <p className="mt-3 text-green-700 font-semibold">
                ✔ Donation Completed
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
