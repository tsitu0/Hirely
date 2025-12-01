const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: true,
    unique: true, 
  },
  slotDateTime: {    
    type: Date,
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
  blockId: {
    type: Number,
    required: true
  }
});

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
