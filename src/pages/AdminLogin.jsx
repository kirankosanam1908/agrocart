import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth"; // Import the login function
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginAdmin({ email, password });
      localStorage.setItem("token", response.token);
      navigate("/admin"); // Redirect to the admin dashboard or home page
    } catch (error) {
      toast.error(error.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/admin/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
