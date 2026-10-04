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

    if (
      !specialization &&
      !experience &&
      !email &&
      !password &&
      !slots &&
      !fee
    ) {
      toast.error("Please fill at least one field to update.");
      return;
    }

    // ✅ FIXED spelling (IMPORTANT)
    const availableSlots = slots
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await API.put("/doctor/update", {
        specialization,
        experience: experience ? Number(experience) : undefined,
        email,
        password,
        availableSlots, // ✅ FIXED
        fee: fee ? Number(fee) : undefined,
      });

      toast.success("Profile updated successfully");
      navigate("/doctor/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-neutral-800 border border-neutral-700 rounded shadow">
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
        <input
          type="text"
          placeholder="Specialization"
          className="w-full mb-4 px-4 py-2 rounded bg-neutral-900 text-white"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />

        <input
          type="number"
          placeholder="Experience (years)"
          className="w-full mb-4 px-4 py-2 rounded bg-neutral-900 text-white"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <input
          type="number"
          placeholder="Fee"
          className="w-full mb-4 px-4 py-2 rounded bg-neutral-900 text-white"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-neutral-900 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 px-4 py-2 rounded bg-neutral-900 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Slots (e.g. 10:00 AM, 11:00 AM)"
          className="w-full mb-6 px-4 py-2 rounded bg-neutral-900 text-white"
          value={slots}
          onChange={(e) => setSlots(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default DoctorSettings;