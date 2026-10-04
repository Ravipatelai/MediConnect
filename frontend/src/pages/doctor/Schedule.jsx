import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/doctor/schedule", {
          withCredentials: true,
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments", err);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus, fee) => {
    try {
      const videoCallLink =
        newStatus === "confirmed" ? `https://meet.jit.si/healthapp-${id}` : "";

      await API.put(
        "/doctor/update-status",
        {
          appointmentId: id,
          status: newStatus,
          videoCallLink,
        },
        { withCredentials: true }
      );

      toast.success(`Appointment ${newStatus}`);

      if (newStatus === "confirmed") {
        await API.post(
          "/doctor/earnings",
          {
            appointmentId: id,
            amount: fee,
          },
          { withCredentials: true }
        );
        toast.success("Earning recorded.");
      }

      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: newStatus, videoCallLink } : appt
        )
      );
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to update status or record earning");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto p-6 bg-neutral-900 min-h-screen text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate("/doctor/dashboard")}
        className="mb-6 text-blue-400 hover:text-blue-500 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">
        Today's Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-400">No appointments scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li
              key={appointment._id}
              className="border border-neutral-700 rounded-lg p-4 shadow-md hover:shadow-lg bg-neutral-800 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-white">
                  {appointment.patientId?.name || "Unknown"}
                </h3>
                <span className="text-sm text-gray-400">
                  {appointment.slot}
                </span>
              </div>

              <p className="text-gray-300 mb-1">Reason: {appointment.reason}</p>
              <p className="text-gray-300 mb-1">
                Date: {new Date(appointment.date).toDateString()}
              </p>

              <p
                className={`mt-2 font-medium ${
                  appointment.status === "confirmed"
                    ? "text-green-500"
                    : appointment.status === "cancelled"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                Status:{" "}
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </p>

              {appointment.status === "confirmed" &&
                appointment.videoCallLink && (
                  <div className="mt-4">
                   <button
  onClick={() =>
    navigate(`/call/healthapp-${appointment._id}`, {
      state: {
        appointmentId: appointment._id,
        doctorId: appointment.doctorId?._id,
        role: "doctor", // or "patient" depending on login
      },
    })
  }
  className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
>
  Join Video Call
</button>

                  </div>
                )}

              {appointment.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        appointment._id,
                        "confirmed",
                        appointment.doctorId?.fee
                      )
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(appointment._id, "cancelled")
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
