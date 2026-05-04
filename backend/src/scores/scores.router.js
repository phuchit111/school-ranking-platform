const express = require('express');
const { param } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles.middleware');
const scoresService = require('./scores.service');
const auditService = require('../audit.service');

const router = express.Router();

function scoresAccess(req, res, next) {
  if (req.user.role === 'ADMIN') return next();
  if (req.user.role === 'SCHOOL_ADMIN' && req.user.schoolId === req.params.schoolId) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
}

router.get(
  '/:schoolId',
  authMiddleware,
  scoresAccess,
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

/** บันทึกคะแนนได้เฉพาะผู้ดูแลระบบ — แอดมินโรงเรียนดูได้อย่างเดียว */
router.put(
  '/:schoolId',
  authMiddleware,
  requireRole('ADMIN'),
  param('schoolId').isUUID(),
  validate,
  async (req, res, next) => {
    try {
      const score = await scoresService.upsertScores(req.params.schoolId, req.body);
      await auditService.log({
        actorId: req.user.sub,
        action: 'scores.upsert',
        entity: 'School',
        entityId: req.params.schoolId,
        ip: req.ip,
      });
      res.json(score);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
