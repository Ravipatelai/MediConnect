import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function AppointmentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Agar state nahi hai to dashboard par bhej do
  if (!state) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Appointment information not found
        </h2>

        <button
          onClick={() => navigate("/patient/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-green-100 text-green-900 rounded shadow text-center relative">
      
      {/* Back Button */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-4">
        ✅ Appointment Confirmed!
      </h2>

      <p className="mb-2">
        Doctor: <strong>{state.doctorName}</strong>
      </p>

      <p className="mb-2">
        Date: <strong>{state.date}</strong>
      </p>

      <p className="mb-2">
        Slot: <strong>{state.slot}</strong>
      </p>

      <p className="mb-4">
        Concern: <strong>{state.reason}</strong>
      </p>

      <Link
        to="/patient/appointments"
        className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        View My Appointments
      </Link>
    </div>
  );
}

export default AppointmentSuccess;