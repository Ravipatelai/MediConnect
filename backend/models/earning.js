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
    default: 0,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Earning", earningSchema);
