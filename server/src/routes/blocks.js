const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Block = require('../models/Block');
const Slot = require('../models/Slot');

// Simple counter helper for globally unique numeric slot ids
async function allocateSlotIds(count) {
  const result = await mongoose.connection.collection('counters').findOneAndUpdate(
    { _id: 'slotId' },
    { $inc: { seq: count } },
    { upsert: true, returnDocument: 'after' }
  );

  const endSeq = result.value?.seq || count;
  return endSeq - count + 1;
}

// POST /api/blocks  -> http://localhost:3001/api/blocks
// Create a new interview block and generate its slots
router.post('/', async (req, res) => {
  const { blockId, interviewerName, startTime, endTime, slotLength } = req.body;

  // Basic input sanity: need positive duration and slot length
  if (!slotLength || slotLength <= 0) {
    return res.status(400).json({ error: 'slotLength must be a positive number' });
  }

  const createdSlots = [];
  let block;

  try {
    // assume data is valid / present like you said, keep this light
    block = new Block({
      blockId,
      interviewerName,
      startTime,
      endTime,
      slotLength,
    });

    const slotTimes = [];
    let currentTime = new Date(startTime);
    const end = new Date(endTime);

    // Validate time window before persisting block
    if (!(currentTime < end)) {
      return res.status(400).json({ error: 'endTime must be after startTime' });
    }

    await block.save();

    // Precompute all slot times so we can allocate ids in one go
    while (currentTime < end) {
      slotTimes.push(new Date(currentTime));
      currentTime = new Date(currentTime.getTime() + slotLength * 60000);
    }

    // Allocate a unique range of ids atomically to avoid collisions
    const startId = await allocateSlotIds(slotTimes.length);
    let nextId = startId;

    for (const slotTime of slotTimes) {
      const slot = new Slot({
        id: nextId,
        blockId: block.blockId,
        slotDateTime: slotTime,  // full date + time
        reserved: false,
        candidateName: null,
        checkedIn: false,
      });

      await slot.save();
      createdSlots.push(slot);
      nextId += 1;
    }

    return res.json({
      message: 'Block created successfully',
      block,
      slots: createdSlots,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Block with this blockId already exists' });
    }
    // Best-effort cleanup if anything fails after creating the block
    if (block?._id) {
      await Promise.all([
        Slot.deleteMany({ blockId: block.blockId }),
        Block.deleteOne({ _id: block._id }),
      ]);
    }
    console.error('Error creating block:', err);
    return res.status(500).json({ error: 'Server error creating block' });
  }
});

module.exports = router;
