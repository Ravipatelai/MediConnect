import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function AppointmentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-green-100 text-green-900 rounded shadow text-center relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-4">✅ Appointment Confirmed!</h2>
      <p className="mb-2">Doctor: <strong>{state?.doctorName}</strong></p>
      <p className="mb-2">Date: <strong>{state?.date}</strong></p>
      <p className="mb-2">Slot: <strong>{state?.slot}</strong></p>
      <p className="mb-4">Concern: {state?.reason}</p>

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
