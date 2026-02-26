import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from "../assests/sdslogo.jpeg"

const images = [
  "https://media.istockphoto.com/id/1314210487/photo/brother-and-sister-packing-clothes-and-toy-in-the-donation-box.jpg?s=1024x1024&w=is&k=20&c=asfi0lPX-7adYWw6CKLCj1DeS8gQbNtvItHvFU3d0zc=",
  "https://plus.unsplash.com/premium_photo-1663100352343-bfbe97b7ac26?q=80&w=877&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1661964021703-59bbdcdbfdab?auto=format&fit=crop&q=80&w=870"
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">

      {/* ================= NAVBAR ================= */}
      <div className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Smart Donation Logo"
              className="h-14 w-auto object-contain"
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
              Smart Donation System
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <Link to="/initiatives" className="hover:text-blue-600">Initiatives</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
          </div>

          {/* Hamburger Icon */}
          <button
            className="md:hidden text-3xl transition-all duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Animated Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center bg-white py-4 space-y-4 text-gray-700 font-medium shadow-md">
            <Link to="/initiatives" onClick={() => setMenuOpen(false)}>Initiatives</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </div>
        </div>
      </div>

      {/* ================= REST OF YOUR PAGE SAME AS BEFORE ================= */}
      
      {/* Carousel */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={images[current]}
          alt="Donation banner"
          className="w-full h-full object-cover transition-all duration-1000"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Make a Difference Today
          </h2>

          <p className="max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg mb-6">
            Join us in spreading kindness — donate, volunteer, or help those in need through our platform.
          </p>

          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Keep your initiatives, about, footer exactly same */}

      {/* ================= INITIATIVES ================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-10">
            Our Initiatives
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            
            <div className="bg-purple-100 shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1048/1048945.png"
                alt="Clothes Donation"
                className="mx-auto w-20 mb-6"
              />
              <h4 className="text-xl font-semibold mb-2">Clothes Donation</h4>
              <p>
                Helping those in need by collecting and distributing clothes, blankets, and essentials.
              </p>
            </div>

            <div className="bg-purple-100 shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
                alt="Food Drive"
                className="mx-auto w-20 mb-6"
              />
              <h4 className="text-xl font-semibold mb-2">Food Drive</h4>
              <p className="text-gray-600">
                Organizing food drives to ensure that no one sleeps hungry in our communities.
              </p>
            </div>

            <div className="bg-purple-100 shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3944/3944425.png"
                alt="Book Help"
                className="mx-auto w-20 mb-6"
              />
              <h4 className="text-xl font-semibold mb-2">Book Help</h4>
              <p className="text-gray-600">
                Empowering students by collecting and sharing educational materials and books.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4">
            Our Mission
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Smart Donation System connects donors, NGOs, and volunteers to make giving simple and impactful.
            Our goal is to ensure every donation reaches the right hands — efficiently and transparently.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Smart Donation System | Developed by 
            <span className="text-blue-400 font-semibold"> Maithili Pathrut</span>
          </p>
        </div>
      </footer>

    </div>
  )
}