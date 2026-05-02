const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const authService = require('./auth.service');

const router = express.Router();

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

module.exports = router;
