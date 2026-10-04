const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: {
    type: String, // not required
    trim: true,
  },
  experience: {
    type: Number,
    
    min: 0,
  },
  availabeSlots: {
    type: [String],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
   fee: {
    type: Number, // 💡 Add this field
    default: 0,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
