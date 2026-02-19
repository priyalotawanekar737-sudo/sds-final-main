import { FaBell } from "react-icons/fa";

export default function Notifications({ notifications }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaBell className="text-blue-600" />
        Notifications
      </h3>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n, i) => (
            <li
              key={i}
              className="border p-3 rounded bg-blue-50 text-sm"
            >
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
