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

router.put("/update", protect, authorizeRole("patient"), updatePatient);
router.post("/book", protect, authorizeRole("patient"), bookAppointment);
router.get("/appointments", protect, authorizeRole("patient"), upcomingAppointments);
router.get("/history", protect, authorizeRole("patient"), AppointmentHistory);
router.post("/review", protect, authorizeRole("patient"), createReview);


module.exports = router;