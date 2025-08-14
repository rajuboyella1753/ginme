  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import api from '../api/api';
  import { useNavigate } from 'react-router-dom';
  export default function SignupPage() {
    const [role, setRole] = useState('user');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
  e.preventDefault();
  try {
    await api.post('/auth/signup', {
      name,
      email,
      password,
      role,
    });
    alert('✅ Signup successful');
    // ✅ Redirect to login page after successful signup
    navigate('/login'); // or navigate(`/${role}/login`);

  } catch (err) {
    alert(err.response?.data?.message || 'Signup failed');
  }
};

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">📝 Ginme Signup</h2>

          <form onSubmit={handleSignup}>
            {/* Role */}
            {/* <label className="block mb-2 text-sm text-white font-medium tracking-wide">
              Signup As
            </label> */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-semibold transition"
            >
              Signup
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  }
