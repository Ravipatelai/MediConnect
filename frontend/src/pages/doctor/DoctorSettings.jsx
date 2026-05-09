import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/api";

function DoctorSettings() {
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slots, setSlots] = useState("");
  const [fee, setFee] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!specialization && !experience && !email && !password && !slots && !fee) {
      toast.error("Please fill at least one field to update.");
      return;
    }

    const availabeSlots = slots
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await API.put(
        "/doctor/update",
        {
          specialization,
          experience,
          email,
          password,
          availabeSlots,
          fee,
        },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-neutral-800 border border-neutral-700 rounded shadow">
      {/* Back Button */}
      <button
        onClick={() => navigate("/doctor/dashboard")}
        className="mb-6 text-blue-400 hover:text-blue-500 transition"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-white text-center">
        Doctor Settings
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Expertise / Specialization</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Experience (in years)</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Consultation Fee (₹)</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep existing password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1">Availability Slots (comma separated)</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
            placeholder="e.g. 09:00 AM, 11:00 AM"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default DoctorSettings;
