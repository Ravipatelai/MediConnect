const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  addVideoCallLink,
} = require("../controllers/appointment");

router.post("/book", bookAppointment);

module.exports = router;
