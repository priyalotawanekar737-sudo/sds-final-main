import React from "react";

export default function About() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-20 px-6 overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300 opacity-20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            About Smart Donation System
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            A transparent, technology-driven platform connecting donors, NGOs,
            and volunteers to create measurable social impact.
          </p>
        </div>

        {/* CONTENT CARDS */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Mission Card */}
          <div className="group bg-white/80 backdrop-blur-lg border border-white/40 shadow-xl rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
            <div className="w-14 h-14 flex items-center justify-center text-2xl rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-6 shadow-md">
              🎯
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to seamlessly connect donors, NGOs, and volunteers,
              ensuring every contribution reaches those in need efficiently and
              transparently. We aim to make social impact simple, secure, and measurable.
            </p>
          </div>

          {/* Vision Card */}
          <div className="group bg-white/80 backdrop-blur-lg border border-white/40 shadow-xl rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
            <div className="w-14 h-14 flex items-center justify-center text-2xl rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white mb-6 shadow-md">
              🌍
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where charitable contributions are maximized,
              communities are empowered, and volunteering becomes an easy and
              rewarding experience. Transparency, trust, and efficiency define our approach.
            </p>
          </div>

          {/* Why Choose Us Card */}
          <div className="group bg-white/80 backdrop-blur-lg border border-white/40 shadow-xl rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
            <div className="w-14 h-14 flex items-center justify-center text-2xl rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-6 shadow-md">
              ⭐
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition">
              Why Choose Us
            </h2>
            <ul className="text-gray-600 space-y-3">
              <li>✔ Secure and verified NGOs & volunteers</li>
              <li>✔ Real-time donation tracking</li>
              <li>✔ Transparent impact reporting</li>
              <li>✔ User-friendly dashboard interface</li>
              <li>✔ Community-driven initiatives</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}