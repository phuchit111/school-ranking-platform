require('dotenv').config();

const app = require('./app');

const PORT = Number(process.env.PORT || process.env.BACKEND_PORT) || 3005;

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${PORT}`);
});
