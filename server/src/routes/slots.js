const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

//http://localhost:3001/api/slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find().sort({ id: 1 }); 
    res.json(slots);
  } catch (err) {
    console.error('Error fetching slots:', err);
    res.status(500).json({ error: 'Server error fetching slots' });
  }
});

// GET /api/slots/:id
// Return a single slot by numeric id
router.get('/:id', async (req, res) => {
  // Guard against non-numeric ids
  const slotID = parseInt(req.params.id, 10);
  if (Number.isNaN(slotID)) {
    return res.status(400).json({ error: 'Invalid slot id' });
  }

  try {
    const slot = await Slot.findOne({ id: slotID });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    res.json(slot);
  } catch (err) {
    console.error('Error fetching slot:', err);
    res.status(500).json({ error: 'Server error fetching slot' });
  }
});

// POST /api/slots/reserve/:id
// Reserve a slot for a candidate
router.post('/reserve/:id', async (req, res) => {
  // Guard against non-numeric ids
  const slotID = parseInt(req.params.id, 10);
  if (Number.isNaN(slotID)) {
    return res.status(400).json({ error: 'Invalid slot id' });
  }

  try {
    const name = req.body.candidateName;
    if (!name) {
      return res.status(400).json({ error: 'Candidate name is required' });
    }

    // Apply update atomically to avoid double booking
    const slot = await Slot.findOneAndUpdate(
      { id: slotID, reserved: false },
      { $set: { reserved: true, candidateName: name, checkedIn: false } },
      { new: true }
    );

    if (!slot) {
      const exists = await Slot.exists({ id: slotID });
      if (!exists) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      return res.status(400).json({ error: 'Slot already reserved' });
    }

    res.json({
      message: 'Slot reserved successfully',
      slot,
    });
  } catch (err) {
    console.error('Error reserving slot:', err);
    res.status(500).json({ error: 'Server error reserving slot' });
  }
});

// POST /api/slots/checkin/:id
// Mark a reserved slot as checked in
router.post('/checkin/:id', async (req, res) => {
  // Guard against non-numeric ids
  const slotID = parseInt(req.params.id, 10);
  if (Number.isNaN(slotID)) {
    return res.status(400).json({ error: 'Invalid slot id' });
  }

  try {
    // Apply update atomically to avoid double check-ins
    const slot = await Slot.findOneAndUpdate(
      { id: slotID, reserved: true, checkedIn: false },
      { $set: { checkedIn: true } },
      { new: true }
    );

    if (!slot) {
      const existing = await Slot.findOne({ id: slotID });
      if (!existing) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      if (!existing.reserved) {
        return res.status(400).json({ error: 'Cannot check in. Slot is not reserved' });
      }
      if (existing.checkedIn) {
        return res.status(400).json({ error: 'Candidate already checked in' });
      }
    }

    res.json({
      message: 'Candidate checked in successfully',
      slot,
    });
  } catch (err) {
    console.error('Error checking in candidate:', err);
    res.status(500).json({ error: 'Server error checking in candidate' });
  }
});

// POST /api/slots/cancel/:id
// Cancel a reservation (reset slot)
router.post('/cancel/:id', async (req, res) => {
  // Guard against non-numeric ids
  const slotID = parseInt(req.params.id, 10);
  if (Number.isNaN(slotID)) {
    return res.status(400).json({ error: 'Invalid slot id' });
  }

  try {
    // Apply update atomically to avoid conflicting cancels
    const slot = await Slot.findOneAndUpdate(
      { id: slotID, reserved: true },
      { $set: { reserved: false, candidateName: null, checkedIn: false } },
      { new: true }
    );

    if (!slot) {
      const existing = await Slot.findOne({ id: slotID });
      if (!existing) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      return res.status(400).json({ error: 'Slot is already not reserved' });
    }
    
    res.json({
      message: 'Slot canceled successfully',
      slot,
    });
  } catch (err) {
    console.error('Error canceling slot:', err);
    res.status(500).json({ error: 'Server error canceling slot' });
  }
});

module.exports = router;
