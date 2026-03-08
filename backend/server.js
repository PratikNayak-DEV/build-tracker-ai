const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/construction-progress';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', imageRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  if (err.message && err.message.includes('Only JPG, PNG, and WEBP')) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Unexpected server error.', details: err.message });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
