const mongoose = require('mongoose');

// This mirrors your old JS objects, but in Mongo
const slotSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,      // so each slot id is unique
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