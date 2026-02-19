import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import { useAuth } from "../../context/AuthContext";

export default function AdminNotifications() {
  const { token } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ✅ Mark notification as read
  const markRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // ✅ Add notification
  const addNotification = async () => {
    if (!message.trim()) {
      alert("Please enter notification message");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/notifications",
        {
          message,
          role: "admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("");
      setShowForm(false);
      fetchNotifications();
      alert("Notification added successfully ✅");
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to save notification");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete notification
  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
      alert("Notification deleted ✅");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete notification");
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Notification
        </button>
      </div>

      {/* ADD FORM */}
      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <textarea
            placeholder="Enter notification message..."
            className="w-full border p-2 mb-3"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={addNotification}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Notification"}
          </button>
        </div>
      )}

      {/* NOTIFICATION LIST */}
      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-3 border rounded ${
              n.isRead ? "bg-gray-100" : "bg-blue-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{n.message}</span>

              <div className="flex gap-3">
                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="text-sm text-blue-600"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(n._id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
