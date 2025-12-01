require('dotenv').config();
const express = require('express'); 
const mongoose = require('mongoose');

const app = express();
app.set('json spaces', 2);
app.use(express.json());

// 1) Connect to MongoDB (Atlas)
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI; set env before starting server');
  process.exit(1);
}

// Allow overriding port via env to avoid conflicts
const PORT = process.env.PORT || 3001;

// Connect once, when the server starts
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

const blocksRouter = require('./routes/blocks');
app.use('/api/blocks', blocksRouter);

const slotsRouter = require('./routes/slots');
app.use('/api/slots', slotsRouter);
