const Doctor = require("../models/doctor");
const User = require("../models/user");

// ==============================
// GET All Unverified Doctors
// ==============================

const getPendingDoctors = async (req, res) => {
  try {

    const unverifiedDoctors = await Doctor.find({
      isVerified: false,
    }).populate("doctorId", "name email");

    return res.status(200).json({
      success: true,
      count: unverifiedDoctors.length,
      doctors: unverifiedDoctors,
    });

  } catch (error) {

    console.error("Error fetching doctors:", error);

    return res.status(500).json({
      success: false,
      message: "Server error fetching doctors",
    });
  }
};

// ==============================
// GET All Patients
// ==============================

const getAllPatients = async (req, res) => {
  try {

    const patients = await User.find({
      role: "patient",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });

  } catch (error) {

    console.error("Error fetching patients:", error);

    return res.status(500).json({
      success: false,
      message: "Server error fetching patients",
    });
  }
};

// ==============================
// VERIFY Doctor
// PATCH /api/admin/verify-doctor/:id
// ==============================

const verifyDoctor = async (req, res) => {
  try {

    const { id } = req.params;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        isVerified: true,
      },
      {
        new: true,
      }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor verified successfully",
      doctor: updatedDoctor,
    });

  } catch (error) {

    console.error("Error verifying doctor:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// EXPORTS
// ==============================

module.exports = {
  getPendingDoctors,
  verifyDoctor,
  getAllPatients,
};