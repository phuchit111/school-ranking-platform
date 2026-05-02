const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { param } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles.middleware');
const uploadService = require('./upload.service');

const uploadRoot = process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const maxMb = Number(process.env.UPLOAD_MAX_SIZE_MB) || 5;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files allowed'));
      return;
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post(
  '/logo/:schoolId',
  authMiddleware,
  requireRole('ADMIN'),
  param('schoolId').isUUID(),
  validate,
  upload.single('logo'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Missing file' });
      }
      const result = await uploadService.saveLogo(req.params.schoolId, req.file);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
