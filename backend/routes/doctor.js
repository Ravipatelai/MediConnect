const express = require("express");
const router = express.Router();
const {
  addDoctorDetails,
  addEarning,
  updateDoctorDetails,
  getDoctorProfile,
  getAllDoctors,
  upcomingAppointments,
  updateAppointmentStatus,
  getDoctorEarnings,
  getDoctorReviews,
} = require("../controllers/doctor");
const { protect } = require("../middlewares/authMiddleware");
// const { authorizeRole } = require("../middlewares/auhtorizeRoles");

router.post("/add-details", protect, addDoctorDetails);
router.post("/earnings", protect, addEarning);
router.put("/update", protect, updateDoctorDetails);
router.get("/profile", protect, getDoctorProfile);
router.get("/all", protect, getAllDoctors);
router.get("/schedule", protect, upcomingAppointments);
router.put("/update-status", protect, updateAppointmentStatus);
router.get("/earnings-report", protect, getDoctorEarnings);
router.get("/reviews", protect, getDoctorReviews);
console.log("Doctor routes loaded");

module.exports = router;
