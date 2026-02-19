import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const stateCityData = {
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubli'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  Delhi: ['New Delhi'],
};

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    state: '',
    city: '',
    pincode: '',
    dob: '',
    role: 'donor',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'state' && { city: '' }),
    });
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;
    const pincodePattern = /^\d{6}$/;

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phonePattern.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    }

    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';

    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!pincodePattern.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode';
    }

    if (!formData.dob) newErrors.dob = 'Date of birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setServerError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[95vh] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Please fill the details to register
        </p>

        {serverError && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className="label">First Name <span className="text-red-500">*</span></label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} className="input" />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="label">Last Name <span className="text-red-500">*</span></label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} className="input" />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone <span className="text-red-500">*</span></label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="input" />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label">Email <span className="text-red-500">*</span></label>
            <input name="email" value={formData.email} onChange={handleChange} className="input" />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input pr-14"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="show-btn">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="label">Birth Date <span className="text-red-500">*</span></label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input" />
            {errors.dob && <p className="error">{errors.dob}</p>}
          </div>

          {/* State */}
          <div>
            <label className="label">State <span className="text-red-500">*</span></label>
            <select name="state" value={formData.state} onChange={handleChange} className="input">
              <option value="">Select State</option>
              {Object.keys(stateCityData).map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="error">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <label className="label">City <span className="text-red-500">*</span></label>
            <select name="city" value={formData.city} onChange={handleChange} className="input">
              <option value="">Select City</option>
              {formData.state &&
                stateCityData[formData.state].map((city) => (
                  <option key={city}>{city}</option>
                ))}
            </select>
            {errors.city && <p className="error">{errors.city}</p>}
          </div>

          {/* Pincode */}
          <div>
            <label className="label">Pincode <span className="text-red-500">*</span></label>
            <input name="pincode" value={formData.pincode} onChange={handleChange} className="input" />
            {errors.pincode && <p className="error">{errors.pincode}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="label">Role <span className="text-red-500">*</span></label>
            <select name="role" value={formData.role} onChange={handleChange} className="input">
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          {/* Button */}
          <div className="md:col-span-2">
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Register
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already registered? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
