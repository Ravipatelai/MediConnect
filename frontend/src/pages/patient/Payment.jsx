import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/api"; // <- Adjust the path as needed

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { name, specialization, fee, date, slot, reason, doctorId } =
    state || {};

  const handleDummyPayment = async () => {
    toast.success("Payment successful! Booking appointment...");

    try {
      await API.post(
        "/patient/book",
        {
          doctorId,
          date,
          slot,
          reason,
          paymentStatus: "paid", // <- set as paid since dummy
        },
        { withCredentials: true }
      );

      toast.success("Appointment booked!");
      navigate("/patient/success", {
        state: {
          doctorName: name,
          date,
          slot,
          reason,
        },
      });
    } catch (err) {
      toast.error("Failed to book appointment.");
      console.error(err);
    }
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

      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
        Payment Page
      </h2>

      <div className="space-y-4">
        <p>
          <strong>Doctor:</strong> {name}
        </p>
        <p>
          <strong>Specialization:</strong> {specialization}
        </p>
        <p>
          <strong>Appointment Date:</strong> {date}
        </p>
        <p>
          <strong>Slot:</strong> {slot}
        </p>
        <p>
          <strong>Reason:</strong> {reason}
        </p>
        <p>
          <strong>Fee:</strong> ₹{fee}
        </p>
      </div>

      <button
        onClick={handleDummyPayment}
        className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
      >
        Pay ₹{fee} with Razorpay (Dummy)
      </button>
    </div>
  );
}

export default Payment;
