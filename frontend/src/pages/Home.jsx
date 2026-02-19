import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Simple auto-sliding carousel images
const images = [
  "https://media.istockphoto.com/id/1314210487/photo/brother-and-sister-packing-clothes-and-toy-in-the-donation-box.jpg?s=1024x1024&w=is&k=20&c=asfi0lPX-7adYWw6CKLCj1DeS8gQbNtvItHvFU3d0zc=",
   "https://plus.unsplash.com/premium_photo-1663100352343-bfbe97b7ac26?q=80&w=877&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661964021703-59bbdcdbfdab?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold text-blue-700">Smart Donation System</h1>
          <div className="space-x-6 text-gray-700 font-medium">
            <Link to="/initiatives" className="hover:text-blue-600">Initiatives</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
          </div>
        </div>
      </nav>

      {/* Carousel Section */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <img
          src={images[current]}
          alt="Donation banner"
          className="w-full h-full object-cover transition-all duration-1000 rounded-md"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Make a Difference Today</h2>
          <p className="max-w-2xl text-lg mb-6">
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

      {/* Initiatives Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto text-center px-6">
    <h3 className="text-3xl font-bold text-blue-700 mb-10">Our Initiatives</h3>
    <div className="grid md:grid-cols-3 gap-10">
      
      {/* Card 1 */}
      <div className="bg-purple-100 shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048945.png"
          alt="Clothes Donation"
          className="mx-auto w-20 mb-6"
        />
        <h4 className="text-xl font-semibold mb-2">Clothes Donation</h4>
        <p className="text-purple-00">
          Helping those in need by collecting and distributing clothes, blankets, and essentials.
        </p>
      </div>

      {/* Card 2 */}
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

      {/* Card 3 */}
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

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-blue-700 mb-4">Our Mission</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Smart Donation System connects donors, NGOs, and volunteers to make giving simple and impactful.
            Our goal is to ensure every donation reaches the right hands — efficiently and transparently.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Smart Donation System | Developed by <span className="text-blue-400 font-semibold">Maithili Pathrut</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
