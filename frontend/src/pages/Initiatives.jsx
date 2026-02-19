import React from "react";

export default function Initiatives() {
  const initiatives = [
    {
      title: "Food Distribution",
      description:
        "Providing meals to underprivileged communities across multiple states.",
      icon: "🍲",
    },
    {
      title: "Medical Camps",
      description:
        "Organizing free health check-ups and awareness camps for rural areas.",
      icon: "🏥",
    },
    {
      title: "Education Support",
      description:
        "Offering school supplies, scholarships, and digital learning resources for children in need.",
      icon: "📚",
    },
    {
      title: "Clean Water Projects",
      description:
        "Installing water purification systems and promoting safe drinking water practices.",
      icon: "💧",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Our Initiatives
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initiatives.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
