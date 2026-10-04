import { useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function PatientSetting() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!name && !email && !age && !gender && !password) {
      toast.error("Please fill at least one field to update");
      return;
    }

    try {
      await API.put(
        "/patient/update",
        { name, email, age, gender, password },
        { withCredentials: true }
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-neutral-800 border border-neutral-700 rounded shadow relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 font-medium"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-white text-center">
        Patient Settings
      </h2>

      <form onSubmit={handleProfileUpdate}>
        <h3 className="text-xl font-semibold text-gray-200 mb-4">
          Update Profile
        </h3>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label className="block text-gray-300 mb-1">Age</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Gender</label>
          <select
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1">
            New Password (optional)
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
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

export default PatientSetting;
