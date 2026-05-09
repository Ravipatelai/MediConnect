const Doctor = require("../models/doctor");
const User = require("../models/user");
const Earning = require("../models/earning");
const Appointment = require("../models/appointment");
const Review = require('../models/review')

const addDoctorDetails = async (req, res) => {
  try {
    const { experience, availableSlots } = req.body;

    if (!experience || !availableSlots || availableSlots.length === 0) {
      return res
        .status(400)
        .json({ error: "Experience and slots are required." });
    }

    const user = await User.findById(req.user.userId);

    if (!user || user.role !== "doctor") {
      return res.status(403).json({ error: "Only doctors can add details." });
    }

    const existingProfile = await Doctor.findOne({ doctorId: user._id });

    if (existingProfile) {
      return res.status(400).json({ error: "Doctor profile already exists." });
    }

    const doctor = new Doctor({
      doctorId: user._id,
      experience,
      availabeSlots: availableSlots,
    });

    await doctor.save();

    return res.status(201).json({
      message: "Doctor details added successfully.",
      doctor,
    });
  } catch (error) {
    console.log("error adding details", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const updateDoctorDetails = async (req, res) => {
  try {
    const { experience, availabeSlots, email, password, specialization, fee } =
      req.body;

    const doctor = await Doctor.findOne({ doctorId: req.user.userId });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    if (experience) {
      doctor.experience = experience;
    }
    if (availabeSlots) {
      doctor.availabeSlots = availabeSlots;
    }
    if (specialization) {
      doctor.specialization = specialization;
    }
    if (email) {
      doctor.email = email;
    }
    if (fee) doctor.fee = fee;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      doctor.password = hashedPassword;
    }

    await doctor.save();

    return res.status(200).json({
      message: "Doctor details updated successfully.",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
    console.log("error updating details", error);
  }
};

// for adding doctor's earning
// const addEarning = async (req, res) => {
//   try {
//     const { amount, appointmentId } = req.body;

//     console.log(req.body)

//     if (!appointmentId || !amount) {
//       return res
//         .status(400)
//         .json({ error: "Appointment ID and amount are required." });
//     }

//     // Ensure it's a doctor user
//     const user = await User.findById(req.user._id);
//     if (!user || user.role !== "doctor") {
//       return res.status(403).json({ error: "Only doctors can add earnings." });
//     }

//     const doctor = await Doctor.findOne({ doctorId: user._id });
//     if (!doctor) {
//       return res.status(404).json({ error: "Doctor profile not found." });
//     }

//     const newEarning = new Earning({
//       doctorId: doctor._id,
//       appointmentId,
//       amount,
//     });

//     await newEarning.save();

//     return res.status(201).json({
//       message: "Earning added successfully.",
//       earning: newEarning,
//     });
//   } catch (error) {
//     console.log("error adding amount", error);
//     return res.status(500).json("Server error");
//   }
// };


const addEarning = async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;

    if (!appointmentId || !amount) {
      return res.status(400).json({ error: "Appointment ID and amount are required." });
    }

    // Validate doctor
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({ error: "Only doctors can add earnings." });
    }

    const doctor = await Doctor.findOne({ doctorId: user._id });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    // Check if earning already exists
    let earning = await Earning.findOne({ doctorId: doctor._id });

    if (earning) {
      // Prevent duplicate appointment entries
      if (!earning.appointmentIds.includes(appointmentId)) {
        earning.appointmentIds.push(appointmentId);
        earning.amount += amount;
      }

      await earning.save();

      return res.status(200).json({
        message: "Earning updated successfully.",
        earning,
      });
    }

    // Create new earning entry
    const newEarning = new Earning({
      doctorId: doctor._id,
      appointmentIds: [appointmentId],
      amount,
    });

    await newEarning.save();

    return res.status(201).json({
      message: "Earning added successfully.",
      earning: newEarning,
    });

  } catch (error) {
    console.log("error adding amount", error);
    return res.status(500).json("Server error");
  }
};




// // Fetching doctor profile with populated doctorId
const getDoctorProfile = async (req, res) => {
  try {
    console.log(req.user._id)
    const doctor = await Doctor.findOne({ doctorId: req.user._id }).populate(
      "doctorId",
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get all verfied doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({isVerified: true}).populate(
      "doctorId",
      "name age email"
    ); // include required user fields

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ error: "No doctors found" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const upcomingAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorId: req.user._id });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const appointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gte: startOfToday }, // Only future or today's appointments
    })
      .populate("doctorId", "fee")
      .populate("patientId", "name email age")
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status, videoCallLink } = req.body; 

    if (!appointmentId || !status) {
      return res.status(400).json({ error: "appointmentId and status are required." });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    appointment.status = status;

    if (videoCallLink && !appointment.videoCallLink) {
      appointment.videoCallLink = videoCallLink;
    }

    await appointment.save();

    res.status(200).json({
      message: "Appointment updated successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getDoctorEarnings = async (req, res) => {
  try {
    console.log("Logged in doctor ID:", req.user._id);

    // Find doctor profile
    const doctor = await Doctor.findOne({ doctorId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    // Find earnings (single entry per doctor)
    const earning = await Earning.findOne({ doctorId: doctor._id })
      .populate({
        path: "appointmentIds",
        populate: {
          path: "patientId",
          select: "name",
        },
      });

    // If no earnings yet
    if (!earning) {
      return res.status(200).json({
        month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
        total: 0,
        consultations: [],
      });
    }

    // Build consultation list
    const consultations = earning.appointmentIds.map((appt) => ({
      _id: appt._id,
      patient: appt.patientId?.name || "Unknown",
      date: appt.date,
      amount: doctor.fee, // FIXED FEE PER APPOINTMENT
    }));

    // Total earnings (from DB)
    const total = earning.amount;

    // Sort by most recent
    consultations.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      total,
      consultations,
    });

  } catch (error) {
    console.error("Error fetching earnings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const getDoctorReviews = async (req, res) => {
  try {
    // Find doctor profile for logged-in user
    const doctor = await Doctor.findOne({ doctorId: req.user._id });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    // Fetch all reviews for this doctor
    const reviews = await Review.find({ doctorId: doctor._id })
      .populate("userId", "name")  // patient name
      .sort({ createdAt: -1 });    // newest first

    // Calculate average rating
    const totalReviews = reviews.length;

    const avgRating =
      totalReviews === 0
        ? 0
        : (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);

    return res.status(200).json({
      avgRating,
      totalReviews,
      reviews,
    });

  } catch (error) {
    console.error("Error fetching doctor reviews:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  addDoctorDetails,
  addEarning,
  updateDoctorDetails,
  getDoctorProfile,
  getAllDoctors,
  upcomingAppointments,
  updateAppointmentStatus,
  getDoctorEarnings,
  getDoctorReviews
};
