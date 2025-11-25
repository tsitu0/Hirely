require('dotenv').config();
const express = require('express'); 
const mongoose = require('mongoose');

const app = express();

app.use(express.json());


// 1) Connect to MongoDB (Atlas)
const MONGO_URI = process.env.MONGO_URI;

// Connect once, when the server starts
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err.message);
  });

const slotsRouter = require('./routes/slots');
app.use('/api/slots', slotsRouter);


const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});