import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
   
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
      role,
    });

    const { token, user } = res.data;

    // Save token and user info to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    alert('😊 Login Successfull');
    // Redirect to dashboard or homepage
    navigate(`/${role}/dashboard`); // based on user/admin
  } catch (err) {
    alert(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">🔐 Ginme Login</h2>

        <form onSubmit={handleLogin}>
          {/* Role */}
          {/* <label className="block mb-2 text-sm text-white font-medium tracking-wide">
            Login As
          </label> */}
          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
 <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
