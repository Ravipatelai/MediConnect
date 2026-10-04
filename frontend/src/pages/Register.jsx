import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../firebase"; // 🔁 Adjust path
import toast from "react-hot-toast";
import API from "../utils/api"; // 🔁 Adjust path

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
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("role", response.data.user.role);
        toast.success("Registration successful");

        if (role === "doctor") navigate("/doctor/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
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

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await API.post(
        "/auth/firebase-login",
        { token, role },
        { withCredentials: true }
      );

      ;
      localStorage.setItem("role", response.data.role);

      toast.success("Signed in with Google");
      if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
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

        {/* Divider */}
        <div className="my-4 flex items-center justify-between">
          <span className="border-t w-1/4 border-gray-600"></span>
          <span className="text-gray-400 text-sm">OR</span>
          <span className="border-t w-1/4 border-gray-600"></span>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border border-gray-600 py-2 rounded hover:bg-neutral-800 transition"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm text-white font-semibold">
            Sign up with Google as {role}
          </span>
        </button>

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
