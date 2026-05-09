const express = require("express");

const router = express.Router();

const {
  getPendingDoctors,
  verifyDoctor,
  getAllPatients,
} = require("../controllers/admin.js");

// Patients
router.get("/patients", getAllPatients);

// Pending Doctors
router.get("/pending-doctors", getPendingDoctors);

// Verify Doctor
router.patch("/verify-doctor/:id", verifyDoctor);

module.exports = router;