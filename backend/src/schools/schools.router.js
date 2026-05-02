const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { optionalAuth } = require('../middleware/optionalAuth.middleware');
const { requireRole } = require('../middleware/roles.middleware');
const schoolsService = require('./schools.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await schoolsService.listPublished(req.query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/all',
  authMiddleware,
  requireRole('ADMIN'),
  async (req, res, next) => {
    try {
      const result = await schoolsService.listAll(req.query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.role === 'ADMIN';
    const school = await schoolsService.getById(req.params.id, isAdmin);
    if (!school) return res.status(404).json({ error: 'Not found' });
    res.json(school);
  } catch (e) {
    next(e);
  }
});

router.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  body('name').isString().notEmpty(),
  body('province').isString().notEmpty(),
  body('affiliation').isString().notEmpty(),
  body('level').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const school = await schoolsService.create(req.body);
      res.status(201).json(school);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  param('id').isUUID(),
  validate,
  async (req, res, next) => {
    try {
      const school = await schoolsService.update(req.params.id, req.body);
      res.json(school);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  param('id').isUUID(),
  validate,
  async (req, res, next) => {
    try {
      await schoolsService.remove(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/:id/publish',
  authMiddleware,
  requireRole('ADMIN'),
  param('id').isUUID(),
  body('isPublished').isBoolean(),
  validate,
  async (req, res, next) => {
    try {
      const school = await schoolsService.setPublished(req.params.id, req.body.isPublished);
      res.json(school);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
