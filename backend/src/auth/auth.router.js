const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const authService = require('./auth.service');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.post(
  '/login',
  loginLimiter,
  body('email').isEmail(),
  body('password').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const tokens = await authService.login(req.body.email, req.body.password);
      res.json(tokens);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/forgot-password',
  forgotLimiter,
  body('email').isEmail(),
  validate,
  async (req, res, next) => {
    try {
      const result = await authService.requestPasswordReset(req.body.email);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/reset-password',
  body('token').isString().notEmpty(),
  body('password').isString().isLength({ min: 6 }),
  validate,
  async (req, res, next) => {
    try {
      const result = await authService.resetPassword(req.body.token, req.body.password);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post('/refresh', body('refreshToken').isString().notEmpty(), validate, async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    await authService.logout(req.user.sub);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await authService.me(req.user.sub);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
