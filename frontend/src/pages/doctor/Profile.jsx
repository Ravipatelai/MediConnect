import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await API.get("/doctor/profile", {
          withCredentials: true,
        });
        setDoctor(response.data);
      } catch (err) {
        toast.error("Failed to fetch profile");
        console.error("Error fetching doctor profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  if (loading) return <Loader />;

  if (!doctor) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-neutral-900 border border-neutral-700 rounded-lg shadow-md text-white">
        <button
          onClick={() => navigate("/doctor/dashboard")}
          className="mb-6 text-blue-400 hover:text-blue-500 transition"
        >
          ← Back
        </button>
        <div className="text-center text-gray-400">
          Doctor profile not found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-neutral-900 border border-neutral-700 rounded-lg shadow-md text-white">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/doctor/dashboard")}
        className="mb-6 text-blue-400 hover:text-blue-500 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">
        Doctor Profile
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
        <ProfileItem label="Name" value={doctor.doctorId?.name || "N/A"} />
        <ProfileItem label="Email" value={doctor.doctorId?.email || "N/A"} />
        <ProfileItem
          label="Specialization"
          value={doctor.specialization || "General"}
        />
        <ProfileItem label="Experience" value={`${doctor.experience ?? 0} years`} />
        <ProfileItem label="Consultation Fee" value={`₹${doctor.fee ?? 0}`} />
        <ProfileItem
          label="Available Slots"
          value={
            doctor.availabeSlots?.length > 0
              ? doctor.availabeSlots.join(", ")
              : "None"
          }
        />
        <ProfileItem
          label="Verified"
          value={
            doctor.isVerified ? (
              <span className="text-green-400 font-semibold">Yes ✅</span>
            ) : (
              <span className="text-red-400 font-semibold">No ❌</span>
            )
          }
        />
      </div>
    </div>
  );
}

// 🔹 Small reusable UI component for each field
const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-gray-400 font-medium">{label}</p>
    <p className="text-white">{value}</p>
  </div>
);

export default Profile;
