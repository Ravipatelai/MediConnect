import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DoctorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/doctor/reviews", { withCredentials: true });

        if (res.data.length === 0) {
          setReviews([]);
          setAvgRating(0);
        } else {
          setReviews(res.data);

          const avg =
            res.data.reduce((sum, r) => sum + r.rating, 0) /
            res.data.length;

          setAvgRating(avg.toFixed(1));
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen bg-neutral-900 text-white max-w-4xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate("/doctor/dashboard")}
        className="mb-6 text-blue-400 hover:text-blue-500 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-blue-400 text-center mb-4">
        Patient Reviews
      </h2>

      {/* Average Rating */}
      <div className="bg-neutral-800 p-5 rounded-lg border border-neutral-700 text-center mb-6">
        <p className="text-xl font-semibold">Average Rating</p>
        <p className="text-4xl font-bold text-yellow-400 mt-2">
          {avgRating} ⭐
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-400">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-neutral-800 p-5 rounded-lg border border-neutral-700 shadow"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">
                  {rev.userId?.name || "Unknown"}
                </p>
                <span className="text-yellow-400 text-xl">
                  {rev.rating} ⭐
                </span>
              </div>

              <p className="text-gray-300 mt-2 italic">
                "{rev.comment}"
              </p>

              <p className="text-gray-500 text-sm mt-2">
                {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorReviews;
