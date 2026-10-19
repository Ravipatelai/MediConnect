
import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

function Login() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter required fields");
      return;
    }

    try {
      const response = await API.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userRole = response.data.user.role;
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("role", userRole);

        toast.success("Login successful");

        if (userRole === "doctor") {
          navigate("/doctor/dashboard");
        } else if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/patient/dashboard");
        }
      } else {
        toast.error("Invalid credentials or user not found");
      }
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Backend response:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to MediConnect
        </h2>

        {/* Role toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["patient", "doctor", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

