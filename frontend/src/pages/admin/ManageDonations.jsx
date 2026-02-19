import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function ManageDonations() {

  // ✅ hooks MUST be here
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState({});
  const [filter, setFilter] = useState("all"); // all | assigned | unassigned


  useEffect(() => {
    fetchDonations();
    fetchVolunteers();
  }, []);

  const fetchDonations = async () => {
    const res = await axios.get("http://localhost:5000/api/donations", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setDonations(res.data);
  };

  const fetchVolunteers = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/volunteers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setVolunteers(res.data);
  };

  const assignDonation = async (donationId) => {
    const volunteerId = selectedVolunteer[donationId];
    if (!volunteerId) return alert("Select a volunteer");

    await axios.put(
      `http://localhost:5000/api/donations/${donationId}/assign`,
      { volunteerId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchDonations();
  };

  const getFilteredDonations = () => {
  if (filter === "assigned") {
    return donations.filter(
      (d) => d.volunteerId && d.status === "assigned"
    );
  }

  if (filter === "unassigned") {
    return donations.filter(
      (d) => !d.volunteerId && d.status === "accepted"
    );
  }

  return donations; // all
};


  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Donations</h1>
      
      <div className="flex gap-3 mb-4">
  <button
    onClick={() => setFilter("all")}
    className={`px-4 py-2 rounded ${
      filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
    }`}
  >
    All Donations
  </button>

  <button
    onClick={() => setFilter("assigned")}
    className={`px-4 py-2 rounded ${
      filter === "assigned" ? "bg-blue-600 text-white" : "bg-gray-200"
    }`}
  >
    Assigned
  </button>

  <button
    onClick={() => setFilter("unassigned")}
    className={`px-4 py-2 rounded ${
      filter === "unassigned" ? "bg-blue-600 text-white" : "bg-gray-200"
    }`}
  >
    Completed
  </button>

  <button
    onClick={() => setFilter("ongoing")}
    className={`px-4 py-2 rounded ${
      filter === "ongoing" ? "bg-blue-600 text-white" : "bg-gray-200"
    }`}
  >
    Ongoing
  </button>

  <button
    onClick={() => setFilter("completed")}
    className={`px-4 py-2 rounded ${
      filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"
    }`}
  >
    Unassigned
  </button>
</div>

      <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

        <tbody>
          {getFilteredDonations().map((d) => (
            <tr key={d._id}>

              <td>{d.title}</td>
              <td>{d.city}</td>
              <td>{d.status}</td>
              <td>
                {d.status === "accepted" && (
                  <>
                    <select
                      onChange={(e) =>
                        setSelectedVolunteer({
                          ...selectedVolunteer,
                          [d._id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      {volunteers.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.name}
                        </option>
                      ))}
                    </select>

                    <button onClick={() => assignDonation(d._id)}>
                      Assign
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
