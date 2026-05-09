const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

const updatePatient = async (req, res) => {
  const { name, email, age, gender, password } = req.body;

  if (!name && !email && !age && !gender && !password) {
    return res.status(400).json({ error: "No fields to update" });
  }

  //   console.log(req.user);

  try {
    const patient = await User.findById(req.user._id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (name) patient.name = name;
    if (email) patient.email = email;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      patient.password = hashedPassword;
    }

    await patient.save();

    return res
      .status(200)
      .json({ message: "Patient updated successfully", patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slot, date, reason, paymentStatus, videoCallLink } = req.body;

    if (!doctorId || !slot || !date) {
      return res.status(400).json({ error: "Doctor, slot, and date are required." });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Optional: Prevent double booking
    const existing = await Appointment.findOne({
      patientId: req.user._id,
      doctorId,
      slot,
      date: parsedDate,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existing) {
      return res.status(400).json({
        error: "You already have an appointment booked at this time.",
      });
    }

    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      slot,
      date: parsedDate,
      reason,
      paymentStatus: paymentStatus || "unpaid",
      videoCallLink: videoCallLink || "",
      status: "pending",
    });

    await appointment.save();

    return res.status(201).json({
      message: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const upcomingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id,
    
      status: { $in: ["pending", "confirmed"] }, // Only fetch pending or confirmed appointments
    }).populate({
    path: "doctorId",
    populate: {
      path: "doctorId", // this is the reference inside Doctor model to User
      select: "name email age gender experience",
    },
  });

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
    console.error("Error fetching upcoming appointments:", error);
  }
};


// routes/patient.js or similar
const AppointmentHistory = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id,
      status: "completed",
    })
      .populate({
        path: "doctorId", // This refers to the Doctor model
        populate: {
          path: "doctorId", // This refers to the actual User
          select: "name",   // Get the name from User
        },
      })
      .sort({ date: -1 });

    const history = appointments.map((appt) => ({
      doctor: appt.doctorId?.doctorId?.name || "Unknown",
      date: appt.date.toISOString().split("T")[0],
      time: appt.slot,
    }));

    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = {
  updatePatient,
  bookAppointment,
  upcomingAppointments,
  AppointmentHistory
};
