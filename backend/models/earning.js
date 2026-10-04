const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointmentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  }],
  amount: {
    type: Number,
    default: 500,
    min: 0,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Earning", earningSchema);
