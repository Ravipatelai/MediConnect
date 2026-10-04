import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

const VideoCall = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const appointmentId = state?.appointmentId;
  const doctorId = state?.doctorId;
  const userRole = state?.role; // "doctor" or "patient"

  useEffect(() => {
    const domain = "meet.jit.si";

    const options = {
      roomName: roomId,
      width: "100%",
      height: "100%",
      parentNode: document.getElementById("jitsi-container"),
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    const endAppointmentAutomatically = async () => {
      try {
        // 1️⃣ Mark appointment completed
        await API.put(
          "/doctor/update-status",
          { appointmentId, status: "completed" },
          { withCredentials: true }
        );

        toast.success("Appointment marked complete!");

        // 3️⃣ Redirect based on user
        if (userRole === "doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate(`/patient/review/${appointmentId}`, {
            state: { doctorId },
          });
        }
      } catch (error) {
        console.error("Auto-complete error:", error);
      }
    };

    // 🔥 When user leaves the meeting → auto complete
    api.addEventListener("videoConferenceLeft", endAppointmentAutomatically);

    return () => api.dispose();
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <div id="jitsi-container" className="w-full h-full"></div>
    </div>
  );
};

export default VideoCall;
