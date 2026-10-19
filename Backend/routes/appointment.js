const express = require("express");
const router = express.Router();
const { bookAppointment } = require("../controllers/appointment");
const { protect } = require("../middlewares/authMiddleware");

router.post("/book", protect, bookAppointment);

module.exports = router;