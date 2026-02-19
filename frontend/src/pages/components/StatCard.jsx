export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
