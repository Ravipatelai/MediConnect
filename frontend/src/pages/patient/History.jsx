import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom"; // 🆕 Import

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 🆕

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/patient/history", {
          withCredentials: true,
        });
        console.log("Fetched history:", res.data);
        setHistory(res.data);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      {/* 🔙 Back button */}
      <button
        onClick={() => navigate("/patient/dashboard")}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 font-medium"
      >
        ← Back
      </button>

      <h2 className="md:text-3xl font-bold text-white text-center mb-6">
        Consultation History
      </h2>

      {history.length === 0 ? (
        <p className="text-center text-white">No history available.</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div
              key={index}
              className="border rounded-md shadow-sm p-5 bg-neutral-800 border-neutral-700 hover:shadow-md transition"
            >
              <div className="flex justify-between mb-2">
                <h3 className="text-xl text-blue-600 font-semibold">
                  Dr. {entry.doctor}
                </h3>
                <span className="text-slate-100">
                  {entry.date} at {entry.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
