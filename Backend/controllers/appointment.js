const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slot, date, reason, paymentStatus, videoCallLink } = req.body;

    if (!doctorId || !slot || !date) {
      return res.status(400).json({ error: "Doctor, slot, and date are required." });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const isSlotBooked = await Appointment.findOne({
      doctorId,
      slot,
      date: parsedDate,
      status: { $ne: "cancelled" },
    });

    if (isSlotBooked) {
      return res.status(400).json({
        error: "This slot is already booked for this date. Please choose another.",
      });
    }

    const newAppointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      slot,
      date: parsedDate,
      reason: reason || "",
      paymentStatus: paymentStatus || "unpaid",
      videoCallLink: videoCallLink || "",
      status: "pending",
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Server error while booking appointment." });
  }
};

module.exports = {
  bookAppointment,
};