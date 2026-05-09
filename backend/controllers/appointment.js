const appointment = require("../models/appointment");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slot } = req.body; 

    if (!doctorId || !slot) {
      return res.status(400).json({ error: "Doctor and slot are required." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isVerified) {
      return res.status(400).json({ error: "Invalid or unverified doctor." });
    }

    // 🛑 Check for already booked slot
    const isSlotBooked = await Appointment.findOne({
      doctorId,
      slot,
      status: { $ne: "cancelled" }, // ignore cancelled appointments
    });

    if (isSlotBooked) {
      return res
        .status(400)
        .json({ error: "This slot is already booked. Please choose another." });
    }

    // ✅ Book the appointment
    const newAppointment = new Appointment({
      patientId: req.user.userId,
      doctorId,
      slot,
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
