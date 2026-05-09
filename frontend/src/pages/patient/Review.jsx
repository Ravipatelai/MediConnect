import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../../utils/api";
import toast from "react-hot-toast";

function Review() {
  const { appointmentId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const doctorId = location.state?.doctorId || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      return toast.error("Please give a rating and comment.");
    }

    try {
      setLoading(true);
      await API.post(
        "/patient/review",
        {
          appointmentId,
          rating,
          comment,
          doctorId
        },
        { withCredentials: true }
      );

      toast.success("Review submitted successfully!");
      navigate("/patient/dashboard"); // Redirect after submission
    } catch (err) {
      console.error("Review error:", err);
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-neutral-800 text-white rounded shadow">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
        Leave a Review
      </h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-3 font-medium">Rating (1 to 5):</label>
        <div className="flex mb-4 space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="block mb-2 font-medium">Comment:</label>
        <textarea
          className="w-full p-3 mb-4 rounded bg-neutral-700 text-white resize-none"
          rows="4"
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default Review;
