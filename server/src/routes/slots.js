const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// GET http://localhost:5000/api/slots
// Return all slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find().sort({ id: 1 }); // sorted by id for consistency
    res.json(slots);
  } catch (err) {
    console.error('Error fetching slots:', err);
    res.status(500).json({ error: 'Server error fetching slots' });
  }
});

// GET /api/slots/:id
// Return a single slot by numeric id
router.get('/:id', async (req, res) => {
  const slotID = parseInt(req.params.id);

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
  const slotID = parseInt(req.params.id);

  try {
    const slot = await Slot.findOne({ id: slotID });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    if (slot.reserved) {
      return res.status(400).json({ error: 'Slot already reserved' });
    }

    const name = req.body.candidateName;
    if (!name) {
      return res.status(400).json({ error: 'Candidate name is required' });
    }

    slot.reserved = true;
    slot.candidateName = name;
    slot.checkedIn = false;

    await slot.save();

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
  const slotID = parseInt(req.params.id);

  try {
    const slot = await Slot.findOne({ id: slotID });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    if (!slot.reserved) {
      return res.status(400).json({ error: 'Cannot check in. Slot is not reserved' });
    }
    if (slot.checkedIn) {
      return res.status(400).json({ error: 'Candidate already checked in' });
    }

    slot.checkedIn = true;
    await slot.save();

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
  const slotID = parseInt(req.params.id);

  try {
    const slot = await Slot.findOne({ id: slotID });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    if (!slot.reserved) {
      return res.status(400).json({ error: 'Slot is already not reserved' });
    }

    slot.reserved = false;
    slot.candidateName = null;
    slot.checkedIn = false;

    await slot.save();

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