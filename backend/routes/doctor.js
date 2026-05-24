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

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Doctor route working" });
});

// DOCTOR ROUTES
router.post("/add-details", protect, addDoctorDetails);

router.put("/update", protect, updateDoctorDetails);

router.get("/profile", protect, getDoctorProfile);

router.get("/all", protect, getAllDoctors);

router.get("/schedule", protect, upcomingAppointments);

router.put("/update-status", protect, updateAppointmentStatus);

router.get("/earnings-report", protect, getDoctorEarnings);

router.get("/reviews", protect, getDoctorReviews);

router.post("/earnings", protect, addEarning);

module.exports = router;