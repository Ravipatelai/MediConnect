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
const { authorizeRole } = require("../middlewares/auhtorizeRoles");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Doctor route working" });
});

// DOCTOR ROUTES
router.post("/add-details", protect, authorizeRole("doctor"), addDoctorDetails);
router.put("/update", protect, authorizeRole("doctor"), updateDoctorDetails);
router.get("/profile", protect, authorizeRole("doctor"), getDoctorProfile);
router.get("/all", getAllDoctors);
router.get("/schedule", protect, authorizeRole("doctor"), upcomingAppointments);
router.put("/update-status", protect, updateAppointmentStatus);
router.get("/earnings-report", protect, authorizeRole("doctor"), getDoctorEarnings);
router.get("/reviews", protect, authorizeRole("doctor"), getDoctorReviews);
router.post("/earnings", protect, authorizeRole("doctor"), addEarning);

module.exports = router;