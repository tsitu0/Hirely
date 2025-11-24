const express = require('express');
const router = express.Router();

// Temp database
let slots = [
  { id: 1, time: "10:00 AM", reserved: false, candidateName: null },
  { id: 2, time: "11:00 AM", reserved: false, candidateName: null },
  { id: 3, time: "1:00 PM", reserved: true, candidateName: "Tom" }
];

//  http://localhost:5000/api/slots
router.get('/', (req, res) => {
  res.json(slots)
});

// http://localhost:5000/api/slots/reserve/:id
router.post('/reserve/:id', (req, res) => {
  const slotID = parseInt(req.params.id);

  //returns a slots object if a match
  const slot = slots.find(s => s.id == slotID);

  //if the object doesnt exist
  if(!slot){
    return res.status(404).json({ error: "Slot not found" });
  }

  if(slot.reserved){
    return res.status(400).json({ error: "Slot already reserved" });
  }
  //body instead of param theres a difference
  const name = req.body.candidateName;
  //if the name isnt provided
  if (!name) {
    return res.status(400).json({ error: "Candidate name is required" });
  }

  //update the slot
  slot.reserved = true;
  slot.candidateName = name;

  res.json({
    message: "Slot reserved successfully",
    slot
  });

});

// http://localhost:5000/api/slots/cancel/:id
router.post('/cancel/:id', (req, res) => {
  const slotID = parseInt(req.params.id);
  const slot = slots.find(s => s.id == slotID);
  if(!slot){
    return res.status(404).json({ error: "Slot not found" });
  }
  if(!slot.reserved){
    return res.status(400).json({ error: "Slot is already not reserved" });
  }
  slot.reserved = false;
  slot.candidateName = null;
  res.json({
    message: "Slot canceled successfully",
    slot
  });
});

module.exports = router;

