import React, { useEffect, useCallback } from "react";
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

  const exitMeeting = useCallback(async () => {
    try {
      if (appointmentId) {
        await API.put(
          "/doctor/update-status",
          { appointmentId, status: "completed" },
          { withCredentials: true }
        );
      }
    } catch (e) {
      console.error(e);
    }
    if (userRole === "doctor") {
      navigate("/doctor/dashboard");
    } else if (appointmentId) {
      navigate(`/patient/review/${appointmentId}`, { state: { doctorId } });
    } else {
      navigate("/patient/dashboard");
    }
  }, [appointmentId, doctorId, userRole, navigate]);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      toast.error("Video service is loading, please wait...");
      return;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: roomId,
      width: "100%",
      height: "100%",
      parentNode: document.getElementById("jitsi-container"),
    };

    let api;
    try {
      api = new window.JitsiMeetExternalAPI(domain, options);
      api.addEventListener("videoConferenceLeft", exitMeeting);
    } catch (err) {
      console.error("Jitsi init error:", err);
    }

    return () => {
      if (api && api.dispose) {
        api.dispose();
      }
    };
  }, [roomId, exitMeeting]);

  return (
    <div className="w-full h-screen bg-black relative">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={exitMeeting}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded shadow transition"
        >
          Leave Call
        </button>
      </div>
      <div id="jitsi-container" className="w-full h-full"></div>
    </div>
  );
};

export default VideoCall;
