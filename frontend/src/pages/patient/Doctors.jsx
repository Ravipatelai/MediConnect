import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get("/doctor/all");
        console.log("Available doctors:", response.data);
        setDoctors(response.data);
      } catch (error) {
        toast.error("Failed to load doctors");
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* 🔙 Back button */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 font-medium"
      >
        ← Back
      </button>

      <h2 className="md:text-3xl font-bold text-blue-400 text-center mb-6">
        Available Doctors
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="bg-neutral-800 border border-neutral-700 shadow p-5 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-xl text-blue-500 font-bold mb-2">
              {doc.doctorId?.name?.toUpperCase() || "UNKNOWN"}
            </h3>
            <p className="text-gray-300 mb-1">
              <strong>Specialization:</strong> {doc.specialization || "General"}
            </p>
            <p className="text-gray-300 mb-1">
              <strong>Experience:</strong> {doc.experience} years
            </p>
            <p className="text-gray-300 mb-1">
              <strong>Today's Availability:</strong>{" "}
              {doc.availabeSlots?.length > 0
                ? doc.availabeSlots.join(", ")
                : "Not Available"}
            </p>
            <p className="text-blue-400 mb-3">
              <strong>Fee:</strong> {doc.fee}
            </p>
            <button
              className="w-full cursor-pointer bg-violet-500 text-white py-2 px-4 rounded hover:bg-violet-700 transition"
              onClick={() =>
                navigate("/patient/book", {
                  state: {
                    doctor: {
                      id: doc._id,
                      name: doc.doctorId?.name,
                      specialization: doc.specialization,
                      fee: doc.fee,
                      slots: doc.availabeSlots || [],
                    },
                  },
                })
              }
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Doctors;
