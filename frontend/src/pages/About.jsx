import React from "react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        About Smart Donation System
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to connect donors, NGOs, and volunteers seamlessly, 
            ensuring every donation reaches those in need efficiently and transparently. 
            We strive to make social impact simple and measurable for everyone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a world where charitable contributions are maximized, 
            communities are empowered, and volunteering becomes an easy, 
            rewarding experience for all. Transparency, trust, and efficiency 
            are at the core of everything we do.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Why Choose Us
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Secure and verified NGOs and volunteers</li>
            <li>Real-time tracking of donations and impact</li>
            <li>User-friendly interface for donors and NGOs</li>
            <li>Community-driven initiatives for greater impact</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
