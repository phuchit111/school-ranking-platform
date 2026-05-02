const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger');
const { errorHandler } = require('./middleware/errorHandler.middleware');
const rankingService = require('./ranking/ranking.service');

const authRouter = require('./auth/auth.router');
const schoolsRouter = require('./schools/schools.router');
const scoresRouter = require('./scores/scores.router');
const rankingRouter = require('./ranking/ranking.router');
const uploadRouter = require('./upload/upload.router');

const app = express();

const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3007';

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);
app.use(express.json());

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200: { description: OK }
 */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/uploads', express.static(uploadPath));

app.use('/api/auth', authRouter);
app.use('/api/schools', schoolsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/ranking', rankingRouter);
app.use('/api/upload', uploadRouter);

app.get('/api/v1/ranking', async (req, res, next) => {
  try {
    const rankings = await rankingService.aiRankingList();
    res.json({
      generatedAt: new Date().toISOString(),
      rankings,
    });
  } catch (e) {
    next(e);
  }
});

app.use(errorHandler);

module.exports = app;
