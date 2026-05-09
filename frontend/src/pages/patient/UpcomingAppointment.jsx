import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UpcomingAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/patient/appointments", {
          withCredentials: true,
        });
        console.log("Fetched appointments:", res.data);
        setAppointments(res.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto relative">
      {/* 🔙 Back button at top-left */}
       <button
      onClick={() => navigate("/patient/dashboard")}
      className="absolute top-4 left-4 cursor-pointer text-blue-500 hover:text-blue-700 font-medium"
    >
      ← Back
    </button>

      <h1 className="md:text-3xl  text-blue-400 font-bold mb-6 text-center">
        {name} Upcoming Appointments
      </h1>

      {appointments.length === 0 ? (
        <p className="text-gray-400 text-center">
          No upcoming appointments found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-neutral-800 p-5 rounded shadow border border-neutral-700"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                Dr. {appt.doctorId?.doctorId?.name?.toUpperCase() || "Unknown"}
              </h2>

              <p className="text-gray-300">
                📅 <strong>Date:</strong>{" "}
                {new Date(appt.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p className="text-gray-300">
                ⏰ <strong>Slot:</strong> {appt.slot}
              </p>
              <p className="text-gray-300">
                📝 <strong>Reason:</strong> {appt.reason || "N/A"}
              </p>
              <p className="text-gray-300">
                🧠 <strong>Specialization:</strong>{" "}
                {appt.doctorId?.specialization || "N/A"}
              </p>
              <p className="text-gray-300">
                🧑‍⚕️ <strong>Experience:</strong> {appt.doctorId?.experience || 0}{" "}
                years
              </p>

              <p
                className={`mt-2 font-medium ${
                  appt.status === "confirmed"
                    ? "text-green-500"
                    : appt.status === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                🔔 <strong>Status:</strong> {appt.status}
              </p>

              <p
                className={`mt-1 font-medium ${
                  appt.paymentStatus === "paid"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                💳 <strong>Payment:</strong> {appt.paymentStatus}
              </p>

              {appt.status === "confirmed" && appt.videoCallLink && (
                <div className="mt-4 flex flex-col gap-2">
                 <button
  onClick={() =>
    navigate(`/call/healthapp-${appt._id}`, {
      state: {
        appointmentId: appt._id,
        doctorId: appt.doctorId?._id,
        role: "patient", // 👈 patient role here
      },
    })
  }
  className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
>
  Join Video Call
</button>



                  <button
                    onClick={async () => {
                      try {
                        await API.put(
                          "doctor/update-status",
                          { appointmentId: appt._id, status: "completed" },
                          { withCredentials: true }
                        );
                        toast.success("Appointment completed!");

                        setAppointments((prev) =>
                          prev.map((a) =>
                            a._id === appt._id
                              ? { ...a, status: "completed" }
                              : a
                          )
                        );

                        navigate(`/patient/review/${appt._id}`, {
                          state: {
                            doctorId: appt.doctorId?._id,
                          },
                        });
                      } catch (err) {
                        console.error("Error completing appointment:", err);
                        toast.error("Failed to complete appointment");
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                  >
                    End Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingAppointment;
