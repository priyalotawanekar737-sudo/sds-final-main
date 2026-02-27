import React, { useEffect, useState } from "react";

export default function Initiatives() {
  const initiatives = [
    {
      title: "Food Donation Drives",
      description:
        "Distributing meals and ration kits to families struggling with hunger and malnutrition.",
      icon: "🍱",
    },
    {
      title: "Clothes Donation Program",
      description:
        "Providing clean and wearable clothing to people facing harsh living conditions.",
      icon: "👕",
    },
    {
      title: "Book Donation Campaign",
      description:
        "Donating textbooks and study materials to children from low-income backgrounds.",
      icon: "📖",
    },
    {
      title: "Education Support Initiative",
      description:
        "Supporting students with scholarships, digital tools, and career mentorship.",
      icon: "🎓",
    },
  ];

  const [hunger, setHunger] = useState(820000000);
  const [poverty, setPoverty] = useState(700000000);
  const [education, setEducation] = useState(250000000);

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prev) => prev + Math.floor(Math.random() * 3));
      setPoverty((prev) => prev + Math.floor(Math.random() * 2));
      setEducation((prev) => prev + Math.floor(Math.random() * 2));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Our Initiatives
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Empowering communities through structured donation systems and impactful social initiatives.
          </p>
        </div>

        {/* PREMIUM CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {initiatives.map((item, index) => (
            <div
              key={index}
              className="relative group p-[2px] rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 transition-all duration-500"
            >
              <div className="bg-white rounded-3xl p-8 h-full shadow-xl group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 flex items-center justify-center text-3xl rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* VISION & MISSION WITH BACKGROUND */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-24"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-black/60 backdrop-blur-sm p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Our Vision & Mission
            </h2>

            <p className="max-w-3xl mx-auto text-lg leading-relaxed mb-10">
              Our mission is to bridge the gap between donors and those in need
              using a transparent, technology-driven donation platform. We
              envision a society where no one sleeps hungry, every child has
              access to education, and every family lives with dignity.
            </p>

            {/* Image Below Text */}
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd59a93b2a72?auto=format&fit=crop&w=900&q=80"
              alt="Mission Work"
              className="mx-auto rounded-2xl shadow-xl w-full max-w-3xl"
            />
          </div>
        </div>

        {/* REAL TIME GLOBAL STATS */}
        <div className="text-center mb-24">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Global Challenges Still Existing
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <h3 className="text-4xl font-bold text-red-600">
                {hunger.toLocaleString()}+
              </h3>
              <p className="text-gray-600 mt-2">
                People suffering from hunger
              </p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <h3 className="text-4xl font-bold text-yellow-600">
                {poverty.toLocaleString()}+
              </h3>
              <p className="text-gray-600 mt-2">
                People living in extreme poverty
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <h3 className="text-4xl font-bold text-purple-600">
                {education.toLocaleString()}+
              </h3>
              <p className="text-gray-600 mt-2">
                Children lacking education
              </p>
            </div>
          </div>
        </div>

        {/* UPDATED YOUTUBE VIDEO */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Awareness & Impact
          </h2>

          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-[450px]"
              src="https://www.youtube.com/embed/RKrXSWihn8c"
              title="Donation Awareness Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}