// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message || 'Upload error' });
  }
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    // eslint-disable-next-line no-console
    console.error(err.stack);
  }
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
