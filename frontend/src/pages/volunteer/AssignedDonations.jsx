import React, { useEffect, useState } from "react";
import api from "../../api"; // your axios instance

const AssignedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch assigned donations
  const loadAssignedDonations = async () => {
    try {
      const res = await api.get("/donations/volunteer/assigned");
      setDonations(res.data);
    } catch (error) {
      console.error("Error loading assigned donations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update donation pickup status
  const updateStatus = async (donationId, newStatus) => {
  try {
    await api.put(
      `/donations/volunteer/update-status/${donationId}`,
      { status: newStatus }
    );

    loadAssignedDonations(); // refresh list
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Unable to update status.");
  }
};


  useEffect(() => {
    loadAssignedDonations();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Assigned Donations</h1>

      {donations.length === 0 ? (
        <p className="text-gray-500">No donations assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="border rounded-lg shadow p-5 bg-white"
            >
              <h2 className="text-xl font-semibold">{donation.title}</h2>
              <p className="mt-2 text-gray-700">{donation.description}</p>

              <div className="mt-3">
                <p>
                  <strong>City:</strong> {donation.city}
                </p>
                <p>
                  <strong>Pincode:</strong> {donation.pincode}
                </p>
                <p>
                  <strong>Donor:</strong>{" "}
                  {donation.donor?.name || "Unknown Donor"}
                </p>
              </div>

              <p className="mt-3">
                <strong>Pickup Status:</strong>{" "}
                <span className="font-semibold text-blue-600">
                  {donation.pickupStatus}
                </span>
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    updateStatus(donation._id, "on_the_way")
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  On The Way
                </button>

                <button
                  onClick={() => updateStatus(donation._id, "collected")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Collected
                </button>

                <button
                  onClick={() => updateStatus(donation._id, "completed")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedDonations;