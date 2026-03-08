const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  uploadImage,
  analyzeImage,
  getHistory,
} = require('../controllers/imageController');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, and WEBP images are allowed.'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/upload', upload.single('image'), uploadImage);
router.post('/analyze', upload.single('image'), analyzeImage);
router.get('/history', getHistory);

module.exports = router;
