import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function BookAppointment() {
  const { state } = useLocation(); // doctor info passed from previous page
  const navigate = useNavigate();

  console.log("Doctor Info:", state);

  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !slot || !reason) {
      toast.error("Please fill all fields.");
      return;
    }

    // Proceed to payment or confirm appointment
    navigate('/patient/payment', {
      state: {
        doctorId: state.doctor.id,
        name: state.doctor.name,
        specialization: state.doctor.specialization,
        fee: state.doctor.fee,
        date,
        slot,
        reason,
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-neutral-800 p-6 rounded shadow text-white relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 font-medium"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Book Appointment</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Doctor</label>
          <input
            type="text"
            value={state?.doctor.name || 'Unknown'}
            disabled
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Slot</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
          >
            <option value="">Select a slot</option>
            {state?.doctor.slots?.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1">Concern / Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-600"
            rows="4"
            placeholder="Describe your concern..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;
