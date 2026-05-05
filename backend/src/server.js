require('dotenv').config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  // eslint-disable-next-line no-console
  console.error('FATAL: Set JWT_SECRET and JWT_REFRESH_SECRET in the environment (required for login).');
  process.exit(1);
}

const app = require('./app');

const PORT = Number(process.env.PORT || process.env.BACKEND_PORT) || 3005;

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${PORT}`);
});
