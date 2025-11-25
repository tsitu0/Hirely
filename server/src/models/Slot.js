const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, 
  },
  time: {
    type: String,
    required: true,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: null,
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
});

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;