const express = require('express');
const { param, body, query } = require('express-validator');
const prisma = require('../prisma');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const auditService = require('../audit.service');
const schoolApplicationService = require('../school-applications/schoolApplication.service');

const router = express.Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.get('/audit-logs', async (req, res, next) => {
  try {
    const logs = await auditService.listRecent(req.query.limit);
    res.json(logs);
  } catch (e) {
    next(e);
  }
});

router.get('/duplicate-schools', async (_req, res, next) => {
  try {
    const dupKeys = await prisma.$queryRaw`
      SELECT "nameKey", COUNT(*)::int AS cnt
      FROM "School"
      GROUP BY "nameKey"
      HAVING COUNT(*) > 1
      ORDER BY cnt DESC, "nameKey" ASC
    `;
    const groups = await Promise.all(
      dupKeys.map(async (row) => {
        const schools = await prisma.school.findMany({
          where: { nameKey: row.nameKey },
          select: {
            id: true,
            name: true,
            province: true,
            affiliation: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        });
        return { nameKey: row.nameKey, count: row.cnt, schools };
      })
    );
    res.json({ groups });
  } catch (e) {
    next(e);
  }
});

router.get(
  '/school-applications',
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate,
  async (req, res, next) => {
    try {
      const result = await schoolApplicationService.listForAdmin(req.query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/school-applications/:id/approve',
  param('id').isUUID(),
  body('initialPassword').isString().isLength({ min: 6 }),
  validate,
  async (req, res, next) => {
    try {
      const result = await schoolApplicationService.approve(req.params.id, req.user.sub, {
        initialPassword: req.body.initialPassword,
      });
      await auditService.log({
        actorId: req.user.sub,
        action: 'school_application.approve',
        entity: 'SchoolApplication',
        entityId: req.params.id,
        meta: { schoolId: result.schoolId, userEmail: result.userEmail },
        ip: req.ip,
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/school-applications/:id/reject',
  param('id').isUUID(),
  body('adminNote').optional().isString(),
  validate,
  async (req, res, next) => {
    try {
      await schoolApplicationService.reject(req.params.id, req.user.sub, {
        adminNote: req.body.adminNote,
      });
      await auditService.log({
        actorId: req.user.sub,
        action: 'school_application.reject',
        entity: 'SchoolApplication',
        entityId: req.params.id,
        ip: req.ip,
      });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/users',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('role').optional().isIn(['ADMIN', 'SCHOOL_ADMIN']),
  validate,
  async (req, res, next) => {
    try {
      const result = await schoolApplicationService.listUsers(req.query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
