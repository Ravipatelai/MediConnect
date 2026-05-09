import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider, signInWithPopup } from "../firebase"; // 👈 import firebase auth
import { useNavigate, Link } from "react-router-dom"; // 👈 for navigation
import API from "../utils/api";
import toast from "react-hot-toast";

function Login() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // 👈 for navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.alert("please enter required fields");
      return;
    }

    try {
      const response = await API.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
 
      if (response.status === 200) {
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("role", response.data.user.role);
        toast.success("Login successful");
        if (role === "doctor") navigate("/doctor/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else navigate("/patient/dashboard");
      } else {
        toast.error("Invalid credentials or user not found");
      }
    } catch (error) {
      toast.error("server error");
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await API.post(
        "/auth/firebase-login",
        { token, role },
        { withCredentials: true }
      );

       localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("role", response.data.user.role);

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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center  mb-6">
          Login to MediConnect
        </h2>

        {/* Role toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["patient", "doctor", "admin"].map((r) => (
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        <div className="my-4 flex items-center justify-between">
          <span className="border-t w-1/4 border-gray-600"></span>
          <span className="text-gray-400 text-sm">OR</span>
          <span className="border-t w-1/4 border-gray-600"></span>
        </div>

        {/* Google Login Button - only for patient & doctor */}
        {role !== "admin" && (
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-600 py-2 rounded hover:bg-neutral-800 transition"
          >
            <FcGoogle className="text-xl" />
            <span className="text-sm text-white font-semibold">
              Sign in with Google as {role}
            </span>
          </button>
        )}

        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
