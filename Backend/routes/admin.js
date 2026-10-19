const express = require("express");

const router = express.Router();

const {
  getPendingDoctors,
  verifyDoctor,
  getAllPatients,
} = require("../controllers/admin.js");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/auhtorizeRoles");

// Patients
router.get("/patients", protect, authorizeRole("admin"), getAllPatients);

// Pending Doctors
router.get("/pending-doctors", protect, authorizeRole("admin"), getPendingDoctors);

// Verify Doctor
router.patch("/verify-doctor/:id", protect, authorizeRole("admin"), verifyDoctor);

module.exports = router;