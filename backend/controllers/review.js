const Review = require("../models/review");
const Appointment = require("../models/appointment");

const createReview = async (req, res) => {
  try {
    const { doctorId, rating, comment, appointmentId } = req.body;
    const userId = req.user._id;

    if (!doctorId || !rating || !comment || !appointmentId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure the appointment exists and belongs to the user
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.patientId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to review this appointment." });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed appointments." });
    }

    // Prevent duplicate review for the same appointment
    const alreadyReviewed = await Review.findOne({
      userId,
      doctorId,
      appointmentId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already submitted a review for this appointment." });
    }

    const review = new Review({
      userId,
      doctorId,
      rating,
      comment,
    });

    await review.save();

    return res.status(201).json({
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { createReview };
