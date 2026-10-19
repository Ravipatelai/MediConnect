const Doctor = require("../models/doctor");
const User = require("../models/user");
const Earning = require("../models/earning");
const Appointment = require("../models/appointment");
const Review = require('../models/review');
const bcrypt = require("bcryptjs");

const addDoctorDetails = async (req, res) => {
  try {
    const { experience, availableSlots, fee, specialization } = req.body;

    const user = await User.findById(req.user._id);

    if (!user || user.role !== "doctor") {
      return res.status(403).json({ error: "Only doctors can add details." });
    }

    let doctor = await Doctor.findOne({ doctorId: user._id });

    const slots = availableSlots || req.body.availabeSlots;
    const expNum =
      typeof experience === "number"
        ? experience
        : !isNaN(Number(experience))
        ? Number(experience)
        : undefined;

    if (doctor) {
      if (expNum !== undefined) doctor.experience = expNum;
      if (slots && slots.length > 0) doctor.availabeSlots = slots;
      if (specialization) doctor.specialization = specialization;
      if (fee !== undefined && !isNaN(Number(fee))) doctor.fee = Number(fee);
      await doctor.save();
      return res.status(200).json({
        message: "Doctor details updated successfully.",
        doctor,
      });
    }

    doctor = new Doctor({
      doctorId: user._id,
      experience: expNum || 0,
      availabeSlots: slots || [],
      specialization: specialization || "",
      fee: fee !== undefined && !isNaN(Number(fee)) ? Number(fee) : 0,
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
    const { experience, availabeSlots, availableSlots, email, password, specialization, fee } =
      req.body;

    const doctor = await Doctor.findOne({ doctorId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    if (experience !== undefined && experience !== "" && !isNaN(Number(experience))) {
      doctor.experience = Number(experience);
    }
    
    const slotsToUpdate = availabeSlots || availableSlots;
    if (slotsToUpdate) {
      doctor.availabeSlots = slotsToUpdate;
    }
    if (specialization) {
      doctor.specialization = specialization;
    }
    if (fee !== undefined && fee !== "" && !isNaN(Number(fee))) {
      doctor.fee = Number(fee);
    }

    // Email and Password belong to the User model, not the Doctor model
    if (email || password) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (email && email !== user.email) {
          const emailExists = await User.findOne({ email });
          if (emailExists) {
            return res.status(400).json({ error: "Email already in use" });
          }
          user.email = email;
        }
        if (password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          user.password = hashedPassword;
        }
        await user.save();
      }
    }

    await doctor.save();

    return res.status(200).json({
      message: "Doctor details updated successfully.",
      doctor,
    });
  } catch (error) {
    console.error("Error updating doctor details:", error);
    return res.status(500).json({ error: "Server Error" });
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
      const alreadyHasAppt = earning.appointmentIds.some(
        (id) => id.toString() === appointmentId.toString()
      );
      if (!alreadyHasAppt) {
        earning.appointmentIds.push(appointmentId);
        earning.amount += Number(amount) || 0;
        await earning.save();
      }

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
    let doctor = await Doctor.findOne({ doctorId: req.user._id }).populate(
      "doctorId",
      "name email"
    );

    if (!doctor) {
      if (req.user.role === "doctor") {
        doctor = await Doctor.create({ doctorId: req.user._id });
        doctor = await Doctor.findById(doctor._id).populate("doctorId", "name email");
      } else {
        return res.status(404).json({ error: "Doctor not found" });
      }
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
    const doctors = await Doctor.find({ isVerified: true }).populate(
      "doctorId",
      "name age email gender"
    );

    return res.status(200).json(doctors || []);
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    return res.status(500).json({ error: "Internal server error" });
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

    // Role-based authorization check
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ doctorId: req.user._id });
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: "Not authorized to update this appointment" });
      }
    } else if (req.user.role === "patient") {
      if (appointment.patientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Not authorized to update this appointment" });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
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