import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { auth, googleProvider, signInWithPopup } from "../firebase"; // 🔁 Adjust path
import toast from "react-hot-toast";
import API from "../utils/api";


function Register() {
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await API.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        },
        {
          withCredentials: true, // Allow cookie (JWT) from backend
        }
      );

      // Success
      if (response.status === 201) {
        const userRole = response.data.user.role;
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("role", userRole);
        toast.success("Registration successful");

        if (userRole === "doctor") navigate("/doctor/dashboard");
        else if (userRole === "admin") navigate("/admin/dashboard");
        else navigate("/patient/dashboard");
      }
    } catch (error) {
      // Handling API errors properly
      if (error.response?.status === 400) {
        toast.error("User already exists");
      } else {
        toast.error("Registration failed. Please try again.");
      }

      console.error("Registration Error:", error);
    }
  };


  return (
    <div className=" min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md  w-full bg-neutral-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl -mt-4 font-bold text-center  mb-6">
          Create Your Account
        </h2>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-3">
          {["patient", "doctor"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  role === r
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
                }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Password</label>
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
            Register as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
