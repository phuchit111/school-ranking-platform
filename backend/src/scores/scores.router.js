const express = require('express');
const { param } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles.middleware');
const scoresService = require('./scores.service');

const router = express.Router();

router.get(
  '/:schoolId',
  authMiddleware,
  requireRole('ADMIN'),
  param('schoolId').isUUID(),
  validate,
  async (req, res, next) => {
    try {
      const score = await scoresService.getScores(req.params.schoolId);
      res.json(score || {});
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  '/:schoolId',
  authMiddleware,
  requireRole('ADMIN'),
  param('schoolId').isUUID(),
  validate,
  async (req, res, next) => {
    try {
      const score = await scoresService.upsertScores(req.params.schoolId, req.body);
      res.json(score);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
