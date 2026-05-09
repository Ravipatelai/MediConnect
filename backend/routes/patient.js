const express = require("express");
const router = express.Router();
const {
  updatePatient,
  bookAppointment,
  upcomingAppointments,
  AppointmentHistory,
} = require("../controllers/patient");
const {createReview} = require("../controllers/review");


const { protect } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/auhtorizeRoles");

router.put("/update", protect, updatePatient);
router.post("/book", protect, bookAppointment);
router.get("/appointments", protect, upcomingAppointments);
router.get("/history", protect, AppointmentHistory)
router.post("/review", protect, createReview);


module.exports = router;
