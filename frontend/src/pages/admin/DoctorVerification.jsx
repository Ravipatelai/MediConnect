import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";

function DoctorVerification() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        const response = await API.get("/admin/pending-doctors");
        setDoctors(response.data.doctors || []);
        console.log("Pending Doctors:", response.data);
      } catch (error) {
        console.error("Error fetching pending doctors:", error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDoctors();
  }, []);

  const handleVerify = async (id) => {
    try {
      await API.patch(`/admin/verify-doctor/${id}`);

      setDoctors((prev) => prev.filter((doc) => doc._id !== id));

      toast.success("Doctor verified successfully");
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error("Failed to verify doctor");
    }
  };

  const handleReject = (id) => {
    setDoctors((prev) => prev.filter((doc) => doc._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" color="blue" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen relative">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-6 text-blue-400 hover:text-blue-500 transition font-medium"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">
        Doctor Verification
      </h2>

      {doctors.length === 0 ? (
        <p className="text-center text-gray-400">
          No pending doctor verifications.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-neutral-800 border-l-4 border-yellow-400 p-5 rounded shadow"
            >
              <h3 className="text-xl font-semibold text-white">
                {doctor.doctorId?.name || "Unknown Doctor"}
              </h3>
              <p className="text-gray-300">
                Experience: {doctor.experience ?? 0} years
              </p>
              <p className="text-gray-300">
                Slots: {doctor.availabeSlots?.length > 0 ? doctor.availabeSlots.join(", ") : "None"}
              </p>
              <p className="text-gray-300">
                Verified: {doctor.isVerified ? "Yes ✅" : "No ❌"}
              </p>

              <div className="flex space-x-3 mt-3">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => handleVerify(doctor._id)}
                  disabled={doctor.isVerified}
                >
                  {doctor.isVerified ? "Verified" : "Verify"}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => handleReject(doctor._id)}
                  disabled={doctor.isVerified}
                >
                  Reject
                </button>
              </div>

              {doctor.isVerified && (
                <p className="text-green-400 font-medium mt-2">
                  Doctor has been verified ✅
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorVerification;
