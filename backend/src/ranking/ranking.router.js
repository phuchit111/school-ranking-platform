const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles.middleware');
const rankingService = require('./ranking.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await rankingService.listRanking(req.query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/top10', async (req, res, next) => {
  try {
    const data = await rankingService.top10();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post(
  '/recalculate',
  authMiddleware,
  requireRole('ADMIN'),
  async (req, res, next) => {
    try {
      const result = await rankingService.recalculateAll();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
